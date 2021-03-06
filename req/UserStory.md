# Ballot 用户故事

## 组织者

Alice希望发起一次线上的无记名投票。了解到ballot.b1f6c1c4.info的功能后，Alice通过浏览器访问http://ballot.b1f6c1c4.info ，浏览器自动跳转到https://ballot.b1f6c1c4.info/ ，迅速加载出了首页并自动识别出了本地中文环境。Alice手动将页面切换至英文。在首页上Alice了解到Ballot的基本功能与使用方法，点击了底部“注册”按钮。

浏览器跳转至注册页面。Alice填写了用户名和密码，并点击“注册”按钮。
浏览器跳转至登录页面，其中用户名已经自动填充好了。Alice填写了密码并点击“登录”按钮。

浏览器跳转至控制台页面，页面上清楚地指示了发起新投票的入口。Alice迅速找到了“发起新投票”按钮并点击。

浏览器跳转至发起新投票页面。Alice填写了投票名称，并点击“创建”按钮。随后页面弹出了“确认发起新投票”对话框，Alice仔细阅读了其中的说明，并点击确认。

浏览器跳转至投票控制台，页面上清楚表明了投票的状态“创建中”。Alice点击页面上的字段编辑按钮。

浏览器跳转至投票编辑页面。Alice点击+号，弹出添加字段对话框。Alice填写了字段提示，选择类型为单选题，并添加了若干个选项。随后Alice尝试将类型改为填空题，再改回单选题，发现之前填写的选项并没有丢失。最后Alice点击添加按钮，页面上出现了一个新的单选题字段，和对应的编辑删除按钮。

Alice不小心要关闭浏览器，不过浏览器弹出窗口提示可能有未保存的更改。Alice点击取消按钮，然后点击保存修改按钮，系统提示字段信息已保存。

Alice尝试点击编辑按钮，打开了“编辑字段”对话框，和之前的对话框基本一致。Alice再尝试点击删除按钮，弹出了确认删除字段对话框。Alice在确认删除以后又想还原之前的操作，于是点击了放弃更改按钮，在确认后还原到了上次保存的字段列表。

过了一会，投票的状态自动变成了“邀请中”，并提示Alice密钥已经就绪，可以邀请投票者。Alice点击上方投票名称，回到控制台，再点击投票者编辑按钮，系统跳转到投票控制台的投票者管理页面。Alice填写了一名投票者的姓名并点击添加投票者，并点击“添加”。随后下方出现一名新的投票者信息，包括状态（目前为“未注册”）、名称、删除按钮和更多信息按钮。展开更多信息，Alice得到了这名投票者的邀请码和邀请链接二维码。Alice这样添加了很多条投票者信息，然后点击上面的“导出”按钮，将姓名和邀请码导出成Excel文件，保存到本地。

Alice将该Excel文件打印出来，剪成小条，通过线下保密渠道分发给各位投票者。当一名投票者注册后，Alice在手机上的投票者管理页面实时刷新，显示该投票者已经注册，并更新其备注、状态（由“未注册”变为“已注册”）。

Alice误添加了一名投票者，于是点击相应的删除按钮，在经过确认后这名投票者就从列表里消失了。

Alice注意到全部投票者都注册以后，点击投票控制台页面“结束邀请”按钮，仔细阅读了页面上相关的说明信息，并点击确认。浏览器刷新，页面上清楚显示了投票的状态“邀请完毕”，并分别概要地显示了投票内容和投票者信息，其中投票内容有一个“编辑”按钮，而投票者信息有一个“查看”按钮。Alice注意到投票内容已经编辑完毕，于是点击“开始预投票”按钮，仔细阅读了页面上相关的说明信息，并点击确认。

投票控制台页面上投票状态变成“预投票”。Alice通过其他渠道将预投票链接发给各投票者，通知各投票者进行预投票。

Alice在特定时间点（已提前告知各位投票者）点击投票控制台页面上的“开始正式投票”按钮，仔细阅读页面上的说明后，点击确认。投票状态变成“正式投票”，页面上也多出了投票结果显示。Alice通过其他渠道将正式投票链接发给各投票者，通知各投票者进行正式投票。

Alice在特定时间点（已提前告知各位投票者）点击投票控制台页面上的“结束正式投票”按钮，仔细阅读页面上的说明后，点击确认。投票状态变成“已结束”。Alice点击投票结果页面的“导出”按钮，将投票结果保存至本地。

## 投票者

Bob从线下保密渠道收到了来自Alice的邀请链接。打开后浏览器跳转至投票者注册页面。Bob输入了备注，并点击注册。弹出了确认注册成为投票者对话框。Bob点击确认，页面上出现一长串私钥。Bob将其妥善地保存起来。

Bob收到Alice的通知称预投票开始后，通过浏览器访问预投票页面。该页面上明确显示了投票名称和投票内容。Bob填写完各字段后，将私钥从本地上传浏览器，并点击“生成签名”按钮。在下方出现进度条，大概一分钟以后出现了已签名的投票内容。Bob将其保存到本地。

Bob收到Alice的通知称正式投票开始后，通过浏览器访问正式投票页面。该页面明确警告不能使用普通浏览器进行投票，强制使用Tor浏览器或者torsocks命令行工具。Bob采用Tor浏览器访问正式投票页面。该页面上明确显示了隐私安全状态（IP、时区、Locale、Javascript状态等），任何一项不正确均会警告无法投票。Bob确认所有隐私安全状态均正常后，将已签名的投票内容粘贴至文本框内并点击提交。

Tor浏览器跳转至提交暂存页面，页面上明确提示已经收到投票，正在验证签名。Bob点击下方“查询”按钮，检查投票状态。Tor浏览器跳转至提交暂存页面或者提交成功页面。在确认提交成功后，Bob关闭了Tor浏览器。

Bob后来（在投票被Alice结束之前）改变了想法，决定更改投票。Bob访问预投票页面，重新填写各字段，粘贴私钥，执行签名，再利用Tor浏览器访问正式投票页面，提交已签名的投票，并检查投票状态为成功。

## 验证者

Victor希望检验投票的真实性。Victor从Alice处得到了投票的链接。Victor访问该链接，可以看到投票参数（状态为“已结束”）、投票内容、投票者、投票统计。

Victor首先验证每个投票是否来自于所谓投票者。Victor点击投票者的“导出数据”、投票统计的“导出数据”、投票参数的“导出数据”，根据数据得到了每个投票都来自于某一名投票者且没有任何一名投票者投过两票的结论。

Victor再验证每个所谓投票者是否是真实的，而非由Alice代为投票。Victor从线下渠道联系Bob，直接验证身份。
