#What is geminiBlog?
(pronounced jay-mini-blog) is a simple browser based blogger mini app displaying a number of static blog entries, written using pure JavaScript and *synchronous* [XMLHttpRequest][1] to fetch the entries, which, initially written in markdown, are complied in client-side using {|marked.js|}, and displayed as posts.

###Features
* *Fast*
* *Minimal*
* *Light weight*
* *Offline ready*
* *Mobile ready*
* *Markdown driven*
* *Using vanilla Javascript + [Marked.js][8], no other libraries required, so far.*
* *Very little technical knowledge needed out of the box.*
* *Little to none HTML required when writing posts.*
* *No server-side facilities needed except storage access.*
* *Comments and reader feedback can be setup using [DISQUS][7].*
 
###Purpose
This app is one of the mini-apps I made while learning JavaScript. 

Usually even to setup a minimal static blog it takes a bit of planning and effort, like where to put the content, how to serve it, which theme to choose etc. But to me, that is too much work for a simple blog, and that is not really productivity nor domain knowledge for the inspired content writer. This app helps those who just want to setup a minimal blog immediately without any hassle and do it right from their code repository or cloud storage, that can host static content, like [github][2] (ofcourse!), [google-drive][3] or [dropbox][4]. Also, to get started with this, you hardly need any html or css knowledge (unless you actually take an interest in customizing or modifying it), although a bit of markdown knowledge is necessary, but I hope you'll definitely enjoy writing

> *\#This is a heading*  

rather than

>&lt;html&gt;  
>&lt;h1&gt; This is a heading &lt;/h1&gt;  
>&lt;/html&gt;.  

when both of them output: 

#This is a heading

won't you?  
(if yes, then head over to the [Creator's blog] [5] or my other app [ParseMD][6] to give writing markdown a try.)
 
###How it works
The entries are files written in markdown format, preferably saved with an extension "_.md_", and stashed away in a container somewhere in the internet. To add them to your blog, you just register their links inside your configuration, i.e inside `config.js`, link the **file** with a **title**, and optionally provide a **publishing date** and **category tags**, and voila!, the app fetches your file upon loading and parses it to valid HTML. There is no further setup needed, so you can keep writing the entries in markdown, and linking them in without having to bother about complications like setting up an environment for the project, or doing maintenance, ever. 

Head over to the [guides](#guide) or check out the [examples](#examples) to get a better grip of what's going on under the hood, and how much tinkering you can do without risking a *crash'n'burn*. Or if you know your scripts, and want to help me out, check the [changelog](#changelog).

[1]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
[2]: https://github.com
[3]: https://drive.google.com
[4]: https://dropbox.com
[5]: http://daringfireball.net/projects/markdown/
[6]: https://arpanpal010.github.io/parsemd
[7]: https://disqus.com
[8]: https://github.com/chjj/marked
