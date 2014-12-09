#Guide Entry 01: Setting up#

So, after checking out and thinking a minute or two, you are actually prepared to give this app a go.
Okay!

To get started, first you need to download my project, either as a zipfile, or just fork/clone my repo.

####Hosting
Then, you need to find a place to host the files.

#####Github
The recommended method to set this up is to use [Github Pages](https://pages.github.com/). After you have setup your first gihub page, just replace the content in the repo with the files below, and push. If you are using this app as a separate repo other than the repo that is your github profile, remember to push to the branch `gh-pages`, not `master`.

#####Google Drive
[Let me google that for you](http://lmgtfy.com/?q=hosting+html+css+js+in+google+drive)

#####Dropbox
[Let me google that for you](http://lmgtfy.com/?q=hosting+html+css+js+in+dropbox)

####Files
The files you need are...

> `index.html`
>> This is the main page. This is what a viewer sees, and this is the page we will be changing in every action the user takes.

>`entries/`
>> This folder is basically a container for all the markdown entries. This introduces a bit of hierarchy into the project, the entries can be kept into this folder, or can be in their own separate folders, or anywhere else, as long as the link registered to the engine in the `index.html` works, so does your blog.

>`js/`
>>{|marked.js|}
>>> This file is the markdown to html parser, sourced from chjj's github page. For a regular user, there isn't any need to change this file. But if you need to change how the markdown is parsed to Html, this is the file for you.

>>`geminiblog.js`
>>> This file runs the blog. Period.  
>>> Just kidding, this file contains all the functions needed for the blog to work smoothly, if you need to change the arrangement of elements, or decide to completely re-write some part of the app, feel free to do so, as I will too, as my understanding of JavaScript improves.

>>`config.js`
>>> This file contains the configurations for the blog. It is used to [register entries](#first-entry) after they are written, set [variables](#configuration), or error messages etc.

>`stylesheets/`
>>`style.css`
>>>This is the page containing the styles, if you need to change how the page looks, you start here.

That's all!  
Head over to [Writing your first entry](#first-entry) to do well, just that.

Although, you can design your own header and footer elements with just a bit of HTML and CSS tweaking, you are free to use the default theme if you want to, just replace the information with yours.
