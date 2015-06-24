# web-resource


如果你在项目之间插入空行，那项目的内容会用 <p> 包起来，你也可以在一个项目内放上多个段落，只要在它前面缩排 4 个空白或 1 个 tab 。

1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.
    
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus. Donec sit amet nisl. 
    Aliquam semper ipsum sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.


* A list item.

    With multiple paragraphs.

* Another item in the list.



可以选择性的加上 title 属性：

This is an [example link](http://example.com/ "With a Title")

这是一个普通段落：

    var dataset = [];
    var strHtml = '';
    var $elem;
    $('.detail-body table tbody tr').each(function(i, n){
        $elem = $(n);
        dataset[i] = {};
        dataset[i].jobNum = $elem.find('td:eq(0)').text();
        dataset[i].name = $elem.find('td:eq(1)').text();
        dataset[i].salary = $elem.find('td:eq(2)').text();
    })
    dataset.sort(function(a,b){
        console.log(a,b, a.salary - b.salary);
        
        return b.salary - a.salary;
    })
    $.each(dataset, function(i, n){
        console.log(n)
        strHtml += '<tr><td>'+ n.jobNum +'</td><td>'+ n.name +'</td><td>'+ n.salary +'</td></tr>';
    })
    $('.detail-body table tbody).html(strHtml)
