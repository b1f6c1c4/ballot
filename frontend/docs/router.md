# Index [/ -> /index.html]

功能介绍

- 组织者入口 - Home Page
- 投票者入口 - Voter Register Page

# Organizer

## Login Page [/app/login -> /app.html]

- 登录 - Home Page
- 注册

## Change Password Page [/app/password -> /app.html]

- 修改密码 - Home Page

## Home Page [/app/ -> /app.html]

- 发起投票 - Create Ballot Page
- 查看全部投票 - Ballot Collection Page
- 查看投票 - View Ballot Page

## Create Ballot Page [/app/create -> /app.html]

- 创建 - View Ballot Page
- 取消 - Home Page

## View Ballot Page [/app/ballots/{bId} -> /app.html]

- 导出密钥
- 编辑投票内容 - Edit Fields Page
- 确认投票内容
- 管理投票者 - Edit Voters Page
- 确认投票者名单
- 启动正式投票
- 查看投票进度 - View Stat Page
- 结束投票

## Edit Fields Page [/app/ballots/{bId}/fields/ -> /app.html]

- 自动保存
- 暂存 - View Ballot Page
- 确认投票内容 - View Ballot Page

## Edit Voters Page [/app/ballots/{bId}/voters/ -> /app.html]

- 添加
- 删除
- 导出
- 确认投票者名单 - View Ballot Page

## View Stat Page [/app/ballots/{bId}/tickets/ -> /app.html]

- 导出
- 返回 - View Ballot Page

# Voter

## Voter Reg Page [/app/vreg -> /app.html]

- 确认注册

## Pre Voting Page [/app/ballots/{bId}/tickets -> /app.html]

- 在本地进行签名

## Vote [/secret/ -> /secret/index.html]

- 检查隐私安全状态
- 提交
- 检查提交状态

