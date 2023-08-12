---
title: "laravel9及PHP8的相关新特性(一)"
date: "2023-06-06 09:43:50"
tags: ["PHP", "PHP8", "Laravel", "Laravel9"]
---

# PHP新特性整理

自`Lavavel6.x`起对`PHP`的版本最低要求是`7.2`，但可能在日常开发中还是以`PHP5.x`的一些思想去开发，很多新特性或比较实用的语法都没用上，所以这里整理了些`PHP5.x`至`PHP8.x`中可能用的上的新特性，更多详情可以查阅[PHP手册](https://www.php.net/manual/zh/appendices.php)下的版本迁移记录。

## PHP5.6.x => PHP7.0.x
> [完整更新记录 https://www.php.net/manual/zh/migration70.php](https://www.php.net/manual/zh/migration70.php)

### 异常机制调整

> [引自 https://www.php.net/manual/zh/language.errors.php7.php](https://www.php.net/manual/zh/language.errors.php7.php)

自`PHP7.x`起所有内部异常类都实现了`Throwable接口`*（但我们无法直接去implements实现该接口，只能通过继承PHP现有的异常类）*，同时`PHP`运行期间的大多数错误都以`Error异常`抛出，`Error异常`是所有内部异常的基类，所以当想要捕获这些由`PHP`内部抛出的异常时可以在`catch`中声明捕获`Error异常`或是顶级的`Throwable接口`。

同时作为用户级的异常基类`Exception异常`，一般的框架都有相应的子异常类实现，这样就很好的区分了捕获的异常是内部异常还是由业务代码自行抛出的用户级异常。

常见的异常捕获场景如下：
```php
try {
    // call ...
} catch (\Exception $e) [
    // ...长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3长长的标题3
}
```
但是这种方式不能捕获`PHP`内部的一些 类型错误 等异常，如下：
```php
try {
    $a = 1;
    $b = $a / 0;
} catch (\Exception $e) {
    // 这里捕获不到
}

// 实际上PHP将抛出 DivisionByZeroError 异常
```
此时如果想正确的捕获异常应该：
```php
// 方式1
try {
    $a = 1;
    $b = $a / 0;
} catch (\Throwable $e) {
    var_export('发生错误');
}

// 方式2(可以是更具体的异常类)
try {
    $a = 1;
    $b = $a / 0;
} catch (\Error $e) {
    var_export('发生错误');
}
```

### 标量类型声明

> [引自 https://www.php.net/manual/zh/migration70.new-features.php](https://www.php.net/manual/zh/migration70.new-features.php)

在`PHP7.0.x`及之后的版本中，扩充了可用于声明的标量类型如`int`，`string`等，同时在这之后也支持了对函数的返回值做类型声明，示例如下：
```php
<?php

class User
{
    /**
     * 用户名
     * PS: PHP7.4之后可以直接在这里声明类成员属性的类型
     *
     * @var string
     */
    protected string $username = '';

    /**
     * 获取用户名
     * PS: 此处声名了方法参数及返回值类型
     *
     * @param int $id 用户id
     * @return string 用户名
     */
    public function getUsername(int $id): string
    {
        return $this->username;
    }

}
```
同时建议养成类型声明的习惯，能显著提高`PHP`代码的可读性，配合IDE能够在编码阶段就发现一些明显的类型错误。

### 严格模式

> [引自 https://www.php.net/manual/zh/language.types.declarations.php#language.types.declarations.strict](https://www.php.net/manual/zh/language.types.declarations.php#language.types.declarations.strict)

当一个函数声明接收一个`int`值，调用者却传递了一个`float`值，此时`PHP`会尝试强转将`float`转为`int`但不会报错，可能有些IDE会提示传参错误但`PHP`在运行期间却不会报错，当类似的情况出现在业务代码中时，可能会引发业务逻辑错误。

所以为了避免这种情况发生，建议在每个`PHP`文件中都声明强制开启`严格模式`，开启`严格模式`后方法只能接受与其声明类型完全匹配的值。

```php
<?php

declare(strict_types=1);

function sum(int $a, int $b): int
{
    return $a + $b;
}

// 正常
sum(1, 2);

// 报错
sum(1.5, 2.5);
```

> 严格模式和非严格模式还有更多区别，可以自行查看文档比较

### null合并运算符

> [引自 https://www.php.net/manual/zh/migration70.new-features.php#migration70.new-features.null-coalesce-op](https://www.php.net/manual/zh/migration70.new-features.php#migration70.new-features.null-coalesce-op)

相当于三元表达式的简写，日常使用到的频率较高，有点类似`PHP5.3`出的`?:`写法。

```php
<?php

// ?? 的写法，以下两者等价
$username = isset($user['name']) ? $user['name'] : '匿名';
$username = $user['name'] ?? '匿名';

// 对比PHP5.3发布的 ?: 的写法，以下两者等价
$username = !empty($user['name']) ? $user['name'] : '匿名';
$username = $user['name'] ?: '匿名';

// 实际开发中可能的例子
$article = Article::query()->with('cover')->find(1);
$coverUrl = $article->cover->file_url ?? '';
```

### 太空般操作符

> [引自 https://www.php.net/manual/zh/migration70.new-features.php#migration70.new-features.spaceship-op](https://www.php.net/manual/zh/migration70.new-features.php#migration70.new-features.spaceship-op)

太空船操作符用于比较两个表达式。如下当`$a`小于、等于或大于`$b`时它分别返回-1、0或1，通常可以用在自定义排序上。

```php
<?php

// 整数
echo 1 <=> 1; // 0
echo 1 <=> 2; // -1
echo 2 <=> 1; // 1

// 用作排序
$userList = [
    ['name' => '张三', 'age' => 30],
    ['name' => '李四', 'age' => 20],
];

usort($userList, function ($a, $b) {
    return $a['age'] <=> $b['age'];
});

?>
```

### 匿名类

> [引自 https://www.php.net/manual/zh/migration70.new-features.php#migration70.new-features.anonymous-classes](https://www.php.net/manual/zh/migration70.new-features.php#migration70.new-features.anonymous-classes)

有点类似匿名函数的概念，可以利用匿名类实例化出对象（支持类的一些特性，如继承等），实际编码中使用场景不多，可能一些框架底层会有使用到。

```php
<?php

class Foo
{
    public function fooInfo()
    {
        echo 'foo info';
    }
}

$bar = new class extends Foo
{
    public function barInfo()
    {
        echo 'bar info';
    }
};

$bar->fooInfo();

$bar->barInfo();
```

## PHP7.0.x => PHP7.1.x

> [完整更新记录 https://www.php.net/manual/zh/migration71.php](https://www.php.net/manual/zh/migration71.php)

### 可为空（Nullable）类型

> [引自 https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.nullable-types](https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.nullable-types)

现在可以声明参数或返回值的类型为`null`，只需要在类型前加上一个`?`即可。 当启用这个特性时，传入的参数或者函数返回的结果要么是给定的类型，要么是`null`。

```php
<?php

function testReturn(?string $name = null): ?string
{
    return $name;
}
```

### Void函数

> [引自 https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.void-functions](https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.void-functions)

可以声明函数的返回值为void，表示函数没有函数值，但当尝试获取返回值时会得到null。
```php
<?php

function test(): void
{

}

echo test(); // null
```

### 短数组语法及增强

> [引自 https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.support-for-keys-in-list](https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.support-for-keys-in-list)

`PHP`中`list()`语法有点类似`Javscript ES6`中的解构语法糖，用来提取数组中的元素同时赋值给多个变量，`PHP7.1.x`中新增了短数组语法`[]`与指定键名特性，使用频率也较高。

短数组语法：
```php
<?php

// 以下两者等价
list($a, $b) = [0, 1];
[$a, $b] = [0, 1]; // $a = 0 ，$b = 1
```

指定键名的情况：
```php
<?php

// 以下两者等价
list('age' => $a, 'username' => $b) = ['username' => '张三', 'age' => 20];
['age' => $a, 'username' => $b] = ['username' => '张三', 'age' => 20]; // $a = 20 ，$b = 张三
```

实际使用场景：
```php
<?php

// 场景1(foreach)：
$userList = [
    ['id' => 1, 'name' => '张三'],
    ['id' => 2, 'name' => '李四'],
];

foreach ($userList as $index => ['id' => $id, 'name' => $name]) {
    var_export($id . $name);
}

// 场景2(函数返回值)：
function userInfo(): array
{
    return ['id' => 1, 'name' => '张三'];
}
['id' => $id, 'name' => $name] = userInfo();
```

### 多异常捕获处理

> [引自 https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.mulit-catch-exception-handling](https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.mulit-catch-exception-handling)

以往的版本中，`try catch`捕获异常时一个`catch`中只能声明一个异常类，在`PHP7.1.x`版本之后得到了增强，可以通过管道符`|`分隔来声明捕获多个异常类，这也比较实用。

```php
<?php

try {
    // run...
} catch (FooException | BarException $e) {
    // handler...
}
```

### 支持为负的字符串偏移量

> [引自 https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.support-for-negative-string-offsets](https://www.php.net/manual/zh/migration71.new-features.php#migration71.new-features.support-for-negative-string-offsets)

现在所有支持偏移量的字符串操作函数 都支持接受负数作为偏移量，包括通过[]或{}操作字符串下标。在这种情况下，一个负数的偏移量会被理解为一个从字符串结尾开始的偏移量，可以理解为倒着取。

```php
<?php

var_dump("abcdef"[-2]); // e
var_dump(strpos("aabbcc", "b", -3)); // 3
```

## PHP7.1.x => PHP7.2.x

> [完整更新记录 https://www.php.net/manual/zh/migration72.php](https://www.php.net/manual/zh/migration72.php)

### 新的对象类型

> [引自 https://www.php.net/manual/zh/migration72.new-features.php#migration72.new-features.object-type](https://www.php.net/manual/zh/migration72.new-features.php#migration72.new-features.object-type)

新的类型`object`，用于参数及函数返回值的类型声明，如函数的返回值可能是好几个类之间的一个实例对象时，可以声明为`object`，一般使用场景不多，通常也不太建议使用，非特殊情况下建议声明为具体的类或拆分代码。

```php
<?php

function test(object $obj) : object
{
    return new SplQueue();
}

test(new StdClass());
```

### 允许重写抽象方法(Abstract method)

> [引自 https://www.php.net/manual/zh/migration72.new-features.php#migration72.new-features.abstract-method-overriding](https://www.php.net/manual/zh/migration72.new-features.php#migration72.new-features.abstract-method-overriding)

当一个抽象类继承于另外一个抽象类时，继承后的抽象类可以重写被继承的抽象类的抽象方法，使用场景不多，而且有一定限制，具体参照文档。


## PHP7.2.x => PHP7.3.x

> [完整更新记录 https://www.php.net/manual/zh/migration73.php](https://www.php.net/manual/zh/migration73.php)

这个版本的更新没有太多实用性的新特性，具体参考文档


## PHP7.3.x => PHP7.4.x

> [完整更新记录 https://www.php.net/manual/zh/migration74.php](https://www.php.net/manual/zh/migration74.php)

### 类成员属性类型声明

> [引自 https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.typed-properties](https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.typed-properties)

可以在定义类成员属性时，声明成员属性的类型。

```php
<?php

class User
{
    /**
     * id
     * PS: 指明了成员变量类型为int
     *
     * @var int
     */
    public int $id;
}
```

### 箭头函数

> [引自 https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.arrow-functions](https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.arrow-functions)

箭头函数提供了一种更简洁的方式定义匿名函数，有点类似`Javascript ES6`中的箭头函数写法。在`PHP`中，匿名函数内部要使用外部上下文中的变量时需要use声明，当使用箭头函数语法时，可以省去`use`，示例如下：

```php
<?php

// 以下两种写法等价

// 写法1
$b = 1;
$sum1 = function (int $a) use ($b): int {
    return $a + $b;
};

// 写法2
$b = 1;
$sum2 = fn (int $a): int => $a + $b;
```

实际使用场景:

```php
$groupId = $request->input('group_id', 0);

$list = Member::query()
    ->when(!empty($groupId), fn ($query) => $query->where('group_id', $groupId))
    ->get();
```

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```

但普通函数相较于箭头函数而言有许多限制，比如只能写一条表达式等，所以在大多数情况下还是得用匿名函数。

### 空合并运算符赋值

> [引自 https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.null-coalescing-assignment-operator](https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.null-coalescing-assignment-operator)

在`PHP7.0`版本中发布了`null合并运算符`特性，是一种三元运算判断的简写方式，而`空合并运算符赋值`在编写形式及效果上也很类似，为一个不存在或为`null`的变量赋一个值。

```php
<?php

// 方式1
$array['key'] ??= computeDefault();

// 方式2 等价
if (!isset($array['key'])) {
    $array['key'] = computeDefault();
}

// 深层次赋值也可以
$a['b']['c']['d'] = 1;
```

有了这种语法后，一般的`null合并运算符`操作相关代码可以再度精简，实际的案例如下：

```php
<?php

// 当获取不到应用的配置信息时，指定默认值

// before
$app = AppService::getInfo(1);
$app['config'] = $app['config'] ?? [ 'status' => 1 ];

// after
$app = AppService::getInfo(1);
$app['config'] ??= [ 'status' => 1 ];
```

### 数组展开操作

> [引自 https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.unpack-inside-array](https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.core.unpack-inside-array)

数组展开操作有点类似`Javascript ES6`中的展开运算符。这种写法的行为与数组`array_splice`函数相似，在数组的某个位置中插入新的数组。

```php
<?php

// array_splice写法
$parts = ['apple', 'pear'];
$fruits = ['banana', 'orange', 'watermelon'];
array_splice($fruits, 2, 0,$parts);

// 数组展开操作写法
$parts = ['apple', 'pear'];
$fruits = ['banana', 'orange', ...$parts, 'watermelon'];
```

### OPcache Preloading(预加载)

> [引自 https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.opcache](https://www.php.net/manual/zh/migration74.new-features.php#migration74.new-features.opcache)

用于提升php的性能。如通过相关配置，可以在启动php-fpm时将定义好的PHP文件提前加载到进程内存中，从而减少后续请求的开销，如我们提前加载了一个带有test函数的`PHP`文件，在之后执行的`PHP`代码中可以直接调用这个test函数，体验上有点类似在调用php内置函数。
>


## PHP7.4.x => PHP8.0.x

> [完整更新记录 https://www.php.net/manual/zh/migration80.php](https://www.php.net/manual/zh/migration80.php)

### 命名参数

> [引自 https://www.php.net/manual/zh/functions.arguments.php#functions.named-arguments](https://www.php.net/manual/zh/functions.arguments.php#functions.named-arguments)

命名参数允许根据参数名而不是参数位置向函数传参。这使得参数的含义自成体系，参数与顺序无关，并允许任意跳过默认值。
命名参数通过在参数名前加上冒号来传递。允许使用保留关键字作为参数名。

```php
<?php

function test(int $a, int $b = 2, int $c = 3): void
{
    echo $a . $b . $c;
}

test(1); // 123
test(1, c: 4); // 124
test(c: 4, b: 5, a: 1); // 154
```

### 注解

> [引自 https://www.php.net/manual/zh/language.attributes.php](https://www.php.net/manual/zh/language.attributes.php)

注解功能提供了代码中的声明部分都可以添加结构化、机器可读的元数据的能力， 注解的目标可以是类、方法、函数、参数、属性、类常量。 通过 反射 API 可在运行时获取注解所定义的元数据。 因此注解可以成为直接嵌入代码的配置式语言。

### 构造器属性提升

> [引自 https://www.php.net/manual/zh/language.attributes.php](https://www.php.net/manual/zh/language.attributes.php)

构造器的参数可以直接提升为类的成员属性，示例如下：
```php
class User
{
    public function __construct(public string $username = '张三')
    {

    }
}

echo (new User)->username; // 张三
echo (new User('李四'))->username; // 李四
```




### 联合类型

> [引自 https://www.php.net/manual/zh/language.types.declarations.php#language.types.declarations.composite.union](https://www.php.net/manual/zh/language.types.declarations.php#language.types.declarations.composite.union)

联合类型接受多个不同的简单类型做为参数。声明联合类型的语法为 T1|T2

```php
<?php

declare (strict_types = 1);

function test(int|float $a): void
{
    echo $a;
}

test(1); // 1
test(1.5); // 1.5
test('1.5'); // 严格模式下报错
```

### match表达式

> [引自 https://www.php.net/manual/zh/control-structures.match.php#control-structures.match](https://www.php.net/manual/zh/control-structures.match.php#control-structures.match)

有点类似switch，具体参考文档

### Nullsafe 运算符

> [引自 https://www.php.net/manual/zh/language.oop5.basic.php#language.oop5.basic.nullsafe](https://www.php.net/manual/zh/language.oop5.basic.php#language.oop5.basic.nullsafe)

类属性和方法可以通过 "nullsafe" 操作符访问： ?->。 除了一处不同，nullsafe 操作符和以上原来的属性、方法访问是一致的： 对象引用解析（dereference）为 null 时不抛出异常，而是返回 null。 并且如果是链式调用中的一部分，剩余链条会直接跳过。

此操作的结果，类似于在每次访问前使用 is_null() 函数判断方法和属性是否存在，但更加简洁。
```php
<?php

// 自 PHP 8.0.0 起可用
$result = $repository?->getUser(5)?->name;

// 上边那行代码等价于以下代码
if (is_null($repository)) {
    $result = null;
} else {
    $user = $repository->getUser(5);
    if (is_null($user)) {
        $result = null;
    } else {
        $result = $user->name;
    }
}
```


## PHP8.0.x => PHP8.1.x

> [完整更新记录 https://www.php.net/manual/zh/migration81.php](https://www.php.net/manual/zh/migration81.php)

### readonly关键字

> [引自 https://www.php.net/manual/zh/language.oop5.properties.php#language.oop5.properties.readonly-properties](https://www.php.net/manual/zh/language.oop5.properties.php#language.oop5.properties.readonly-properties)

`readonly`修饰符用于类成员属性，可以将成员属性标记为只读。
```php
<?php

class User
{
    public readonly string $username = '张三';
}

$user = new User;
echo $user->username; // 张三
$user->username = '李四'; // 报错
```

### 枚举类

> [引自 https://www.php.net/manual/zh/language.enumerations.php](https://www.php.net/manual/zh/language.enumerations.php)

```php
<?php
enum HttpCode: int
{
    case Success = 200;
}

echo HttpCode::Success->value; // 200
```

### 纯交集类型

当一个值需要同时满足多个类型约束时，使用交集类型。注意，目前无法将交集和联合类型混合在一起，例如 A&B|C。

```php
<?php
function generateSlug(HasTitle&HasId $post)
{
    return strtolower($post->getTitle()) . $post->getId();
}
```

### 新的初始化器

对象现在可以用作默认参数值、静态变量和全局常量，以及属性参数。

```php
<?php

class Bar
{
    public function __construct(
        public string $name = ''
    ) {}
}
class Foo
{
    public function __construct(
       public Bar $bar = new Bar('123')
    ) {

    }
}
echo (new Foo)->bar::class; // Bar
echo (new Foo)->bar->name; // 123
```


### Fibers
> 待补充