! function(w) {
    "use strict";
    // !-- -------------------------------------------------------- -->
    // !-- Utilities												-->
    // !-- -------------------------------------------------------- -->
    // implementing $ with queryselector(+all)
    var $ = function(selector, rootNode) {
        return (rootNode || document).querySelector(selector);
    };
    var $$ = function(selector, rootNode) {
        return Array.prototype.slice.call((rootNode || document).querySelectorAll(selector));
    };
    var utils = {
        escapeRegExp: function(string) { // escape regex
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        },
        capFirst: function(text) { // capitalize first char, lower the rest
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        },
        clearElements: function(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            return container;
        },
        hideElement: function(container) {
            container.style.opacity = "0";
        },
        showElement: function(container) {
            container.style.opacity = "1";
        },
        show: function(container) {
            container.style.display = "initial";
        },
        hide: function(container) {
            container.style.display = "none";
        },
        // register custom events
        registerEvent: function(event, bubbles, cancelable) {
            return (CustomEvent) ? new CustomEvent(event, {
                bubbles: bubbles,
                cancelable: cancelable
            }) : (document.createEvent('Event').initEvent(event, bubbles, cancelable));
        },
        // custom listeners
        registerListener: function(target, type, callback) { (target.addEventListener || target.attachEvent)(target.addEventListener ? type: 'on' + type, callback);
        },
        removeListener: function(target, type, callback) { (target.removeEventListener || target.detachEvent)(target.removeEventListener ? type: 'on' + type, callback);
        },
        // template string to dom element , remember to return el.childNodes[0] // or use element accordingly;
        str2WrappedDOMElement: function(html) {
            var el = document.createElement('div');
            el.innerHTML = html;
            // return el.childNodes[0];
            return el;
        },
        // minimal ajax // use this.<attr> in callbacks to access the xhr object directly
        ajax: function(o) {
            o.useAsync = o.useAsync || true;
            if (!o.method || ! o.url || ! o.success) return false;
            var xhr = w.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.timeout = geminiBlog.timeout || 4000;
            // throws syntax error otherwise
            if (o.mimeType) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
            xhr.ontimeout = function() {
                console.error("Request timed out: " + o.url);
            };
            xhr.onerror = o.error ? o.error: function() {
                console.log(xhr);
            };
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    o.success ? o.success(xhr) : (function() {
                        console.log(xhr);
                    })();
                    // } else {
                    //	   console.log(xhr);
                }
            }
            xhr.open(o.method, o.url, o.useAsync);
            xhr.send(null);
        },
    };
    // !-- -------------------------------------------------------- -->
    // !-- Variables												-->
    // !-- -------------------------------------------------------- -->
    // global var
    var geminiBlog = {
        blogTitle       : "Blog",       // blog title
        archiveTitle    : "Archive",    // archive title
        author			: "John Doe",   // post author
        entries			: [],			// holds meta of all entries
        freshNumber		: 7,			// how many entries to show in snippets
        templates		: [],			// for all templates
        variables		: [],			// for all variables in posts
        variablePrefix	: '{|',			// {|this|} is a variable
        variablePostfix : '|}',
        snippetLength	: 170,			// how many characters to show per entry snippet?
        prevnextLinks   : true,          // previous and next blog post button links at the bottom of each post
        repoBase		: "./markdown/", // all entries beginning with ./  are prepended this url
        useAsync		: true,			// whether to use synchronous HTTP requests (bad idea)
        timeout			: 4000,			// request timeout
        markDownloads	: false,		// whether markdown files can be downloaded by the viewers
    };
    // !-- -------------------------------------------------------- -->
    // !-- Templates												-->
    // !-- -------------------------------------------------------- -->
    // default templates, can be overridden in config
    geminiBlog.templates = {
        snippetViewTemplate : [
            "<div class='snippet-wrapper'>",
                "<h2 class='entry-title'>",
                    "<a class='snippet-title'></a>",
                "</h2>",
                "<div class='entry-content'>",
                "</div>",
            "</div>"
        ].join(''),

        RecentPostsTemplate : [
            "<div class='recent-posts-wrapper'>",
                "<div class='blah-blah'>",
                    "<a class='list-group-item'>",
                    "<span class='badge'></span>",
                    "</a>",
                "</div>",
            "</div>"
        ].join(''),

        detailsViewTemplate : [
            "<article class='details-wrapper'>",
                "<div class='details-head'>",
                    "<div class='details-head-wrapper'>",
                        "<span class='details-separator'> » </span>",
                        "<span class='details-date label label-default'></span>",
                    "</div>",
                "</div>",
                "<div class='details-body'>",
                "</div>",
                "<div class='details-footer'>",
                    "<hr></hr>",
                    "<div class='markdown-source'>",
                        "( The source markdown file for this entry can be found <a id='md-src'>Here</a> )",
                    "</div>",
                    "<ul class='pager'>",
                        "<li class='previous'>",
                            "<a id='previous-link'>&larr; Older</a>",
                        "</li>",
                        "<li class='next'>",
                            "<a id='next-link'>Newer &rarr;</a>",
                        "</li>",
                    "</ul>",
                "</div>",
            "</article>"
        ].join(''),

        archiveViewTemplate : [
            "<div class='page-header'>",
                "<h2 class='post-title'>",
                    "<a class='post-title-url'></a>",
                "</h2>",
                "<p class='meta text-muted'>",
                    "<span class='archive-post-separator'> » </span>",
                    "<span class='post-date label label-default'></span>",
                "</p>",
            "</div>"
        ].join(''),

        searchNoResultsTemplate : [
            "<div class='oh-search-snap'>",
                "<div class='alert alert-dismissible alert-info'>",
                    "<p>Nothing found.</p>",
                "</div>",
            "</div>"
        ].join(''),

    }
    // !-- -------------------------------------------------------- -->
    // !-- Functions												-->
    // !-- -------------------------------------------------------- -->
    geminiBlog.registerEntry = function(entryUrl, title, pubDate) { // required entryUrl
        // register the .md file as an entry and add it to geminiBlog.entries
        var pd = new Date(pubDate) || null;
        title = title || entryUrl;
        var id = title.replace('.md', '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
        // if url begins with ./ replace it with repoBase, else leave as is and consider as full url
        var eurl = (entryUrl.slice(0, 2) === "./") ? geminiBlog.repoBase + entryUrl.slice(2) : entryUrl;

        // create the entry object
        var entry = { // properties of each entry
            index: geminiBlog.entries.length,
            id: id,
            url: eurl,
            title: title,
            pubDate: pd,
        };
        geminiBlog.entries.push(entry);
    };
    // sort list by a key - default: pubDate
    geminiBlog.sortEntries = function(key, elist, reverse) {
        key = key || "pubDate" // "pubDate";
        elist = elist || geminiBlog.entries;
        reverse = reverse || true; // most recent first // highest value first
        elist.sort(function(a, b) {
            var keyA = a[key];
            var keyB = b[key];
            if (reverse) {
                return ((keyA < keyB) ? 1: ((keyA > keyB) ? - 1: 0));
            }
            else {
                return ((keyA < keyB) ? - 1: ((keyA > keyB) ? 1: 0));
            }
        });
    }
    // find entries by their id
    geminiBlog.getEntryById = function(eid) {
        if (geminiBlog.entries.length === 0) {
            return false;
        }
        if (geminiBlog.entries.length === 1) {
            return geminiBlog.entries[0];
        }
        for (var i in geminiBlog.entries) {
            // alert(geminiBlog.entries[i].id + " " + eid);
            if (geminiBlog.entries[i].id === eid) {
                return geminiBlog.entries[i];
            }
        }
        // alert(geminiBlog.entries[i].id+" "+eid);
        return false;
    }
    // find entries by their indexd
    geminiBlog.getEntryByIndex = function(eindex) {
        if (geminiBlog.entries.length === 0) {
            return false;
        }
        if (geminiBlog.entries.length === 1) {
            return geminiBlog.entries[0];
        }
        for (var i in geminiBlog.entries) {
            // alert(geminiBlog.entries[i].id + " " + eid);
            if (geminiBlog.entries[i].index === eindex) {
                return geminiBlog.entries[i];
            }
        }
        // alert(geminiBlog.entries[i].id+" "+eid);
        return false;
    }
    // markdown to html conversion function with variable replacement
    /* markdown2html parser https://github.com/chjj/marked/ */
    if (w.marked) {
        geminiBlog.markDownOptions = geminiBlog.markDownOptions || {
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        }
        // this function makes html from markdown
        geminiBlog.mdToHTML = function(md) {
            if (marked && geminiBlog.markDownOptions) {
                return marked(geminiBlog.handleVars(md), geminiBlog.markDownOptions);
            }
            return false;
        }
    }
    // parse and replace variables in entry
    geminiBlog.handleVars = function(markd, vname, vvalue) {
        // read vprefix and vpostfix from config
        // just replace if variable and value provided
        vname = vname || "";
        vvalue = vvalue || null;
        // if name and value provided, do just that
        if (vname !== "" && vvalue != null) {
            return markd.replace(new RegExp(utils.escapeRegExp(geminiBlog.variablePrefix + vname + geminiBlog.variablePostfix), 'g'), vvalue);
        }
        // else try defined variables
        for (var i = 0; i < geminiBlog.variables.length; i++) {
            vname = geminiBlog.variables[i].name;
            vvalue = geminiBlog.variables[i].value;
            markd = markd.replace(new RegExp(utils.escapeRegExp(geminiBlog.variablePrefix + vname + geminiBlog.variablePostfix), 'g'), vvalue);
        }
        return markd;
    }
    geminiBlog.createRecentPosts = function(entry) {
        var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.RecentPostsTemplate);
        var wrapper = $('.recent-posts-wrapper', snippetViewHTML);
        wrapper.setAttribute('id', entry.id)
        //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

        var head = $('.blah-blah', wrapper);

        //set title
        $('.list-group-item', head).setAttribute("href", "#!post=" + entry.id);
        $('.list-group-item', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

        return snippetViewHTML.childNodes[0];

    }
    geminiBlog.createSnippet = function(entry, sliceAmount) {
        sliceAmount = sliceAmount || geminiBlog.snippetLength;

        var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.snippetViewTemplate);
        var wrapper = $('.snippet-wrapper', snippetViewHTML);
        wrapper.setAttribute('id', entry.id)
        //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

        var head = $('.entry-title', wrapper);

        //set title
        $('.snippet-title', head).setAttribute("href", "#!post=" + entry.id);
        $('.snippet-title', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;

        if (!entry.snippetHtml) {
            entry.snippetHtml = geminiBlog.mdToHTML(entry.text.slice(0, sliceAmount) + "&hellip;");
        }
        $('.entry-content', wrapper).innerHTML = entry.snippetHtml;

        // console.log(snippetViewHTML.innerHTML);
        // return inner dom
        return snippetViewHTML.childNodes[0];
    }
    geminiBlog.createDetails = function(entry) {
        var detailsViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.detailsViewTemplate);

        var head = $('.details-head-wrapper', detailsViewHTML);

        //set title
        //$('.details-title', head).setAttribute("href", "#!post=" + entry.id);
        $('.details-date', head).setAttribute("id", entry.id);
        //$('.details-title', head).textContent = entry.title;
        $('.details-date', head).textContent = "Posted by " + geminiBlog.author +
            " on " + entry.pubDate.toLocaleDateString();

        //set content
        $('.details-body', detailsViewHTML).innerHTML = entry.html;

        //footer
        var footer = $('.details-footer', detailsViewHTML);

        //markdown source
        if(geminiBlog.markDownloads) {
            $('#md-src', footer).setAttribute('href', entry.url);
        } else {
            utils.hide($('.markdown-source', footer));
        }

        if (geminiBlog.prevnextLinks)
        {
            // next link
            if (entry.index > 0) {
                $('#next-link', footer).setAttribute("href", "#!post=" + geminiBlog.getEntryByIndex(entry.index - 1).id);
                $('#next-link', footer).setAttribute("title", geminiBlog.getEntryByIndex(entry.index - 1).title);
            } else {
                // remove link
                utils.hide($('#next-link', footer));
            }
            // previous link
            if (entry.index < geminiBlog.entries.length - 1) {
                $('#previous-link', footer).setAttribute("href", "#!post=" + geminiBlog.getEntryByIndex(entry.index + 1).id);
                $('#previous-link', footer).setAttribute("title", geminiBlog.getEntryByIndex(entry.index + 1).title);
            } else {
                // remove link
                utils.hide($('#previous-link', footer));
            }
        } else {
            utils.hide($('#next-link', footer));
            utils.hide($('#previous-link', footer));
        }

        // console.log(detailsViewHTML.innerHTML);
        return detailsViewHTML.childNodes[0];
    }
    geminiBlog.createArchiveHtml = function(entry) {
        var archiveViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.archiveViewTemplate);
        var wrapper = $('.page-header', archiveViewHTML);
        //wrapper.setAttribute("onclick", "document.location.href = '#!post=" + entry.id + "'");

        var head = wrapper; //$('.archive-head', wrapper);

        //set title
        $('.post-title-url', head).setAttribute("href", "#!post=" + entry.id);
        $('.post-title-url', head).textContent = (entry.title.length > 35) ? entry.title.slice(0, 35) + "...": entry.title;
        $('.post-date', head).textContent = entry.pubDate.toLocaleDateString();

        // return inner dom
        return archiveViewHTML.childNodes[0];
    }

    // shows a subsection of entries in snippet mode, heading + a partial of content + meta
    geminiBlog.snippetView = function(entries, containerClass, sliceLength) {
        document.title = geminiBlog.blogTitle;
        // You must have >= md posts than geminiBlog.freshNumber
        entries = entries || geminiBlog.entries.slice(0, geminiBlog.freshNumber);
        sliceLength = sliceLength || geminiBlog.freshNumber - 1;
        var container = utils.clearElements($(containerClass || geminiBlog.containerDiv));

        entries.forEach(function(entry, index) {
            // fetch entry and process
            if (!entry.text) {
                utils.ajax({
                    method: "GET",
                    url: entry.url,
                    mimeType: "text/plain; charset=x-user-defined",
                    success: function(xhr) {
                        //console.log('processEntry(): Status: ' + xhr.status);
                        entry.text = xhr.responseText;
                        entry.html = geminiBlog.mdToHTML(xhr.responseText);

                        //create and add snippet
                        //console.log("Loaded entry: " + entry.index + ": " + entry.title + " " + entry.pubDate.toLocaleDateString());
                        if (index < sliceLength) container.appendChild(geminiBlog.createSnippet(entry));

                        // dispatch event
                        // event.data = entry;
                        // document.dispatchEvent(event);
                    },
                    error: function() {
                        //console.error(this.statusText);
                        response = error404;
                        return false;
                    }
                })
            } else {
                //create and add snippet
                //console.log("Found entry: " + entry.index + ": " + entry.title + " " + entry.pubDate.toLocaleDateString());
                if (index < sliceLength) container.appendChild(geminiBlog.createSnippet(entry));
            }
        });
        geminiBlog.showRecentPosts();
    }
    geminiBlog.showRecentPosts = function() {
        var entries = geminiBlog.entries.slice(0, geminiBlog.freshNumber);
        var recent_container = utils.clearElements($(geminiBlog.recentDiv));

        entries.forEach(function(entry) {
            recent_container.appendChild(geminiBlog.createRecentPosts(entry));
        });
    }
    geminiBlog.detailsView = function(entry, containerClass) {
        document.title = entry.title;
        var container = utils.clearElements($(containerClass || geminiBlog.containerDiv));

        var detailsViewInstructions = function(entry) {
            //create and add snippet
            //console.log("Loaded entry: " + entry.index + ": " + entry.title + " " + entry.pubDate.toLocaleDateString());
            container.appendChild(geminiBlog.createDetails(entry));

            // scroll(0,posTop); // scroll to top after the entry loads, set the px value in config depending on header height
            // scroll upto entry.id anchor, markdown heading is just below
            document.getElementById(entry.id).scrollIntoView(true);
        }

        // fetch entry and process
        if (!entry.text) {
            utils.ajax({
                method: "GET",
                url: entry.url,
                mimeType: "text/plain; charset=x-user-defined",
                success: function(xhr) {
                    //console.log('processEntry(): Status: ' + xhr.status);
                    entry.text = xhr.responseText;
                    entry.html = geminiBlog.mdToHTML(xhr.responseText);

                    //generate
                    detailsViewInstructions(entry);

                },
                error: function() {
                //	console.error(this.statusText);
                    response = error404;
                    return false;
                }
            })
        } else {
            //create and add details
            detailsViewInstructions(entry);
        }
        geminiBlog.showRecentPosts();
    }
    geminiBlog.archiveView = function(containerClass) {
        document.title = geminiBlog.archiveTitle;
        var container = utils.clearElements($(containerClass || geminiBlog.containerDiv));

        geminiBlog.entries.forEach(function(entry) {
            container.appendChild(geminiBlog.createArchiveHtml(entry));
        });
        geminiBlog.showRecentPosts();
    }
    geminiBlog.searchView = function() {
        document.title = geminiBlog.searchTitle;
        var container = utils.clearElements($(geminiBlog.containerDiv));
        var foundPosts = false;

        geminiBlog.entries.forEach(function(entry) {
            if (entry.title.toLowerCase().match(
                        document.getElementById("uzer-infut").value.toLowerCase())) {
                container.appendChild(geminiBlog.createArchiveHtml(entry));
                foundPosts = true;
            }
        });

        if (!foundPosts) {
            var snippetViewHTML = utils.str2WrappedDOMElement(geminiBlog.templates.searchNoResultsTemplate);
            container.appendChild(snippetViewHTML.childNodes[0]);
        }

        geminiBlog.showRecentPosts();
    }

    geminiBlog.submitIt = function() {
        var anchor = document.location.hash.substring(2).toLowerCase();
            anchor === "search" ?
                geminiBlog.searchView() :
                document.location.href = "#!search";
    }

    geminiBlog.router = function() {
        // if anchored - show entry maching id with anchor or tag matching anchor or default page
        var anchor = document.location.hash.substring(2).toLowerCase(); // substring(2) removing hashbang

        if (anchor !== "") {

            // routing done here based on hashbang anchors
            switch (true) {
                case anchor === "frontpage" : return geminiBlog.snippetView();;
                case anchor === "archive"	: return geminiBlog.archiveView();;
                case anchor === "search"    : return geminiBlog.searchView();;

                // parse posts by regex
                case(/^post=(.*)/.test(anchor)):
                    if (geminiBlog.getEntryById(anchor.match(/^post=(.*)/)[1])) {
                    return geminiBlog.detailsView(geminiBlog.getEntryById(anchor.match(/^post=(.*)/)[1]));
                } else {
                    document.location.href = "#!frontpage";
                }
                break;

                default:
                    document.location.href = "#!frontpage";
                break;
            }
        }

        // default - snippetview of fresh entries
        return geminiBlog.snippetView();
    }

    // setup = these functions are run after the page finishes loading
    geminiBlog.init = function() {
        // sort the lists
        geminiBlog.sortEntries("pubDate", geminiBlog.entries, false);

        // populate sidebar with a list of entries - comment this out if sidebar is hidden
        // listView();
        // show view accordingly by router
        geminiBlog.router();
        utils.registerListener(w, 'hashchange', geminiBlog.router);
    }

    // Bootstrap dropdown menu without jquery
    var daMenus = {

        // Navbar and dropdowns
        toggle: document.getElementsByClassName('navbar-toggle')[0],
        collapse: document.getElementsByClassName('navbar-collapse')[0],

        toggleMenu: function() { // Toggle if navbar menu is open or closed
            daMenus.collapse.classList.toggle('collapse');
        },

        // Close dropdowns when screen becomes big enough to switch to open by hover
        closeMenusOnResize: function() {
            if (document.body.clientWidth >= 768) {
                daMenus.collapse.classList.add('collapse');
            }
        },
    };


    // !-- -------------------------------------------------------- -->
    // !-- Start the event listeners								-->
    // !-- -------------------------------------------------------- -->
    // fire geminiBlog.init() after page load or if the anchor changes
    utils.registerListener(w, 'load', geminiBlog.init);

    // search form
    document.getElementById('uzer-infut').addEventListener('input', geminiBlog.submitIt, false);
    document.getElementById('submitfutton').addEventListener('click', geminiBlog.submitIt, false);

    // dropdown menus
    utils.registerListener(w, 'resize', daMenus.closeMenusOnResize);
    daMenus.toggle.addEventListener('click', daMenus.toggleMenu, false);

    // debug
    w['geminiBlog'] = geminiBlog;

} (window);
// vim: set ft=javascript
