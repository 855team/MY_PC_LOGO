export default {
    keywords: [
        'ST', 'HT',                         // 显示隐藏乌龟
        'FD', 'BK', 'LT', 'RT',             // 前后左右
        'CLEAN', 'CS',                      // 清屏复位, 清屏不复位
        'PU', 'PD',                         // 提笔落笔
        'SETXY', 'SETX', 'SETY',            // 坐标定位
        'SETPC', 'SETW', 'SETWIDTH',        // 设定笔颜色、粗细
        'SETBG', 'SETBGPATTERN',            // 设定背景颜色、花纹
        'STAMPOVAL', 'STAMPRECT',           // 画圆、矩形
        'FILL',                             // 填色
        'PRINT', 'PR',                      // 控制台输出
        'MAKE',                             // MAKE "变量名 表达式，用于赋值
        'REPEAT', 'RT',                     // 重复
        'TO', 'END'                         // Procedure开始、结束
    ],

    tokenizer: {
        root: [
            { include: '@numbers' },
            [/[a-zA-Z]\w*/, {
                cases: {
                    '@keywords': 'keyword'
                }
            }]
        ],
        numbers: [
            [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, 'number']
        ],
    }
}