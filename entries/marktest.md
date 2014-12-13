#Markdown test

This is an example entry for testing the display of the entries, as well as showing what you can actually do with markdown.
You can download the markdown text version [here](./entries/marktest.md) for comparison.

[This is actually a null link, but is how you add a comment]: <>
[This will not show up in the converted html]: <>

Headings
========
# This is the same as a h1 tag.

##h2 is the
same as this.
------

###h3
####h4
#####h5
######h6  

* * * 
###Breaks

Line breaks are done by putting two spaces after the line ends,  
like this, or by putting a blank line inbetween,

like this.

-------
###Blockquotes
>Blockquotes are written like this. All the lines beginning with a &gt; is  >considered a blockquote.  
> 
>This is the second paragraph.  
>And so it continues.
>    >Also, They can be nested.
>

-------
###lists
 \* or \+  or numbered lists are interchangeable but only numbered ones are ordered (actual numbers don't matter). They can be quoted or may contain heading, other lists etc.

7. Item 1
3. Item 2
* Item 3
+ Item 4
- Item 5
3. Item 6
   4. Item 6.1
   5. Item 6.2
      8. Item 6.2.1
      45. etc

-------
###code

       Code blocks are indented 2TABs=8spaces at minimum. They are rendered as preformatted <pre><code>code</code></pre> elements.
                And can be
                        nested.

for a literal &lt;code&gt; tag, wrap the text in backtick "`".

` code snippet here. `

-------
###links

This is [an example link](http://www.google.com "Google")  

And [this link] [ref] actually follows a reference to ...  
bla bla bla  
[ref]: http://www.google.com "Google"

or [another link] []

[another link]: http://www.yahoo.com

The references can be anything even numbers.

------
###emphasis

*&lt;em&gt;phasis*  is the same as _emphasis_

or  

**&lt;strong&gt;phasis** and __&lt;strong&gt;phasis__

------
###Images

![alt text] (imgsrc "optional title")  
or with ids...

![alt text][id]

[id]: img src "optional title"

![Here lies a cat] (https://c1.staticflickr.com/1/116/270312303_b61521b303.jpg "Here lies a cat!")

------
###autolinks
<http://example.com>

<mailme@example.com>

-------
###escapes

Escape special characters in URLs:  
http://images.google.com/images?num=30&amp;=larry+bird  

Escaping special characters  
&amp; &lt; &gt; &copy;

\*This is an escaped asterisk \*

\   backslash  
`   backtick  
\*   asterisk  
_   underscore  
{}  curly braces  
[]  square brackets  
()  parentheses  
\#   hash mark  
\+   plus sign  
\-   minus sign (hyphen)  
.   dot  
!   exclamation mark  

