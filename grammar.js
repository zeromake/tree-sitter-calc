module.exports = grammar({
    name: "calc",
    // 跳过空白符号
    extras: () => [
        /\s/
    ],
    rules: {
        // 第一个表达式会作为解析起始
        // 数字或者表达式
        expression: $ => choice($.number, $.binary_expression),
        // 表达式 +,-,*,/ 左右再次引用 expression，然后就自带重复效果
        // 记得必须要使用 prec.left，或者 prec.right 否则无法生成代码
        binary_expression: $ => choice(...[
            ['+', 0],
            ['-', 0],
            ['*', 1],
            ['/', 1]
        ].map(([operator, r]) => prec.left(r, (seq(
            field('left', $.expression),
            field('op', operator),
            field('right', $.expression)
        ))))),
        // 支持下划线的数字
        number: $ => seq(optional(choice('-', '+')), /\d(_?\d)*/)
    }
});
