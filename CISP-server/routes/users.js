const express = require('express');
const Users = require('../models/users');
const { baseSend, commonVaildate, catchError, readReqData } = require('../utils/server');
const { getMeetItemFromObj } = require('../utils/object');
const Router = express.Router({ caseSensitivea: true });
const { encrypt, meetEncrypt } = require('../utils/encryptOrDecrypt');
const { getRandom } = require('../utils/math');
const fs = require('fs');

// 验证添加用户
async function vaildateAdd(userInfo) {
    return await getMeetItemFromObj(userInfo, ['loginId', ['loginPwd', (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd)))]], ['nickname', 'enabled', 'type', ['avatar', async (avatar) => {
        if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(path.resolve(__dirname, '../public/images'));
            return `http://localhost:${process.env.PORT || 3000}/public/images/${images[getRandom(1, images.length - 1)]}`
        }
        return avatar
    }], 'mail', 'qq', 'wechat', 'intro', 'lastLoginDate', 'addr', 'phone', 'online', 'birthDay']);
}

// 验证修改
async function vaildateModify(userInfo) {
    return await getMeetItemFromObj(userInfo, [], [['loginPwd', (loginPwd) => Promise.resolve(encrypt(meetEncrypt(loginPwd)))], 'nickname', 'enabled', 'type', ['avatar', async (avatar) => {
        if (!avatar) {
            // 使用默认图片
            const images = await fs.promises.readdir(path.resolve(__dirname, '../public/images'));
            return `http://localhost:${process.env.PORT || 3000}/public/images/${images[getRandom(1, images.length - 1)]}`
        }
    }], 'mail', 'qq', 'wechat', 'intro', 'lastLoginDate', 'addr', 'phone', 'online', 'birthDay']);
}

// 获取所有用户
Router.get('/', async function (req, res) {
    const { count, rows } = await Users.findAndCountAll();
    res.send(baseSend(200, '', { datas: rows, count }));
})

// 分页获取用户
Router.get('/list', async function (req, res, next) {
    let { page, limit } = req.query;
    limit = +limit;
    if (page < 0 || !limit && limit < 0) {
        // 请求未满足期望值
        return catchError(next, '请求的参数数据类型或值不满足要求')();
    }
    const result = await Users.findAndCountAll({
        limit,
        offset: (+page - 1) * limit
    }).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (result == null) {
        next('查询用户数据失败');
        return;
    }
    result && res.send(baseSend(200, '', { datas: rows, count }));
});

// 获取单个用户
Router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    const query = await Users.findByPk(id).catch(catchError(next, '传递的数据类型有误，请检查'));
    if (query == null) {
        next('传递的id有误，请检查');
        return;
    }
    query && res.send(baseSend(200, '', { datas: query }));
});

// 验证帐号密码是否正确
Router.post('/vaildate', async function (req, res, next) {
    const body = await readReqData(req).catch(err => catchError(next, `传递的请求体有误，${err}`)())
    if (!body) return;
    const { nickname, loginPwd } = body;
    const result = await Users.findOne({
        where: {
            nickname,
            loginPwd: encrypt(meetEncrypt(loginPwd))
        }
    }).catch(catchError(next, '传递的数据类型有误'));
    if (result == null) {
        next('帐号或密码不正确');
        return
    }
    result && res.send(baseSend(200, '', { datas: result }))
})

// 用户登录
Router.post('/login', async function (req, res, next) {
    // 验证登录是否成功
    const body = await readReqData(req).catch(err => catchError(next, `传递的请求体有误，${err}`)());
    if (!body) return;
    const { nickname, loginPwd, saveTime = 1000 * 60 } = body;
    const userInstance = await Users.findOne({ where: { nickname, loginPwd: encrypt(meetEncrypt(loginPwd)) } }).catch(catchError(next, '传递的数据类型有误，登录失败'));
    if (userInstance) {
        req.session.userId = userInstance.getDataValue('loginId');
        req.session.cookie.maxAge = saveTime;
        res.send(baseSend(200, '登录成功', { datas: userInstance }));
    }
    if (userInstance == null) {
        res.send(baseSend(417, '帐号密码不正确，登录失败'));
    }
})

// 用户恢复登录状态
Router.get('/login/whoamI', async function (req, res, next) {
    if (req.session.userId) {
        const userInstance = await Users.findByPk(req.session.userId).catch(catchError(next, `登录信息有误，请重新登录`));
        if (userInstance == null) {
            res.send(baseSend(200,'登录信息已失效，请重新登录'))
        }
        userInstance && res.send(baseSend(200, '恢复登录成功', { datas: userInstance }));
        return
    }
    res.send(baseSend(200,'登录信息已失效，请重新登录'));
})

// 用户退出登录
Router.post('/logout', async function (req, res, next) {
    req.session.userId = null;
    res.send(baseSend(200, '退出登录成功'));
})

// 新增一个用户
Router.post('/add', async function (req, res, next) {
    const userInstance = await commonVaildate(req, next, Users, vaildateAdd, 'create');
    if (userInstance == null) {
        next('新增用户失败');
        return;
    }
    userInstance && res.send(baseSend(200, '', { datas: userInstance }));
});

// 新增多个用户
Router.post('/addList', async function (req, res, next) {
    const userInstances = await commonVaildate(req, next, Users, vaildateAdd, 'bulkCreate');
    if (userInstances == null) {
        next('新增用户失败');
        return;
    }
    userInstances && res.send(baseSend(200, '', { datas: userInstances, count: userInstances.length }));
})

// 修改用户信息
Router.put('/:id', async function (req, res, next) {
    const { id } = req.params;
    const result = await commonVaildate(req, next, Users, vaildateModify, 'update', null, {
        where: {
            loginId: id
        },
        returning: true
    });
    if (result == null) {
        next('传递的id有误，请检查');
        return;
    }
    result && res.send(baseSend(200, '', { datas: result[1], count: result[0] }));
})

// 删除一个用户
Router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const deleteRows = await Users.destroy({
        where: {
            loginId: id
        },
    }).catch(err => catchError(next, '传递的数据类型有误，请检查'));
    if (deleteRows == null) {
        next('传递的id有误，请检查');
        return;
    }
    typeof deleteRows === 'number' && res.send(baseSend(200, '', { datas: null, count: deleteRows }));
});

module.exports = Router;