//-- ######################################################## -->

    geminiBlog.author = "Aaron";           // posts author
    geminiBlog.blogTitle = "Aaron's Blog"; // front page title
    geminiBlog.archiveTitle = "Archive";   // archive page title
    geminiBlog.searchTitle = "Search";     // search page title

    geminiBlog.freshNumber = 7;            // default posts to display

    //trim each post on front page after X chars
    geminiBlog.snippetLength = 170;

    // previous and next blog post button links at the bottom of each post
    geminiBlog.prevnextLinks = true;

    //enable markdown sources to be downloaded
    geminiBlog.markDownloads = true;

//-- ######################################################## -->


// register new entries here
// "./file.md", "Post title", "April 01, 2016"

//-- ######################################################## -->



    geminiBlog.registerEntry("./nas_cloud.md", "The home: NAS or cloud. Have both.", "March 30, 2016");
    geminiBlog.registerEntry("./new_goodies.md", "New goodies", "September 03, 2015");
    geminiBlog.registerEntry("./switching_from_archlinux_to_gentoo.md", "Switching from Archlinux to FreeBSD then Gentoo", "August 29, 2015");
    geminiBlog.registerEntry("./dwm_to_xmonad.md", "Switching from dwm to xmonad", "August 15, 2015");
    geminiBlog.registerEntry("./custom_repo_with_signed_packages.md", "Custom repo with signed packages", "August 15, 2015");
    geminiBlog.registerEntry("./random_cpu_spikes.md", "Random CPU spikes", "August 01, 2015");
    geminiBlog.registerEntry("./encrypted_chat_with_otr.md", "Encrypted chat with OTR", "July 31, 2015");
    geminiBlog.registerEntry("./torchlight2_segfaults.md", "Torchlight 2 segfaults", "July 14, 2015");
    geminiBlog.registerEntry("./boot_loader_encryption.md", "Boot loader encryption", "June 20, 2015");


//-- ######################################################## -->

// Advanced customizations

//-- ######################################################## -->
    geminiBlog.repoBase = "./markdown/"; //remember the ending slash
    geminiBlog.useAsync = true; // enable when being served
    geminiBlog.timeout = 10000; //milliseconds after which an async request 404s

    //markdown parsing options - passed to marked() in mdConvert()
    geminiBlog.markDownOptions = {
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        //langPrefix: 'hljs ',
        highlight: function(code, lang) {
            return hljs.highlightAuto(code, [lang]).value
        }
    }

//-- ######################################################## -->

//variables
    //anything enclosed between these is considered a variable
    geminiBlog.variablePrefix = "{|";
    geminiBlog.variablePostfix = "|}";

    geminiBlog.variables = [
        //{'name': "variable", 'value': "varValue"},
        //in your markdown post: {|img|} will be replaced by the value below
        {name : "img" , value : "https://wifiextender.github.io/img/file"},
    ];

//-- ######################################################## -->

//divs used in compositing the page
//don't touch unless you know what u doin
    geminiBlog.containerDiv = "#entries-wrapper";
    geminiBlog.recentDiv = "#recent-posts";

//-- ######################################################## -->

//Errors and other messages
    //404 - entry not found
    var error404 = ["#Sorry!!!#",
        "###The entry you requested cannot be found.#",
        "####Please try again later.#",
        "Possible reasons of unavailability:  ",
            "* Entry does not exist (yet).",
            "* Entry not found at the URL [#{|title|}][1].",
            "* Are you connected to the internet?",
        "",
        "####Would you like to return [home][2]?#",
        "[1]:{|url|}",
        "[2]:{|blogHome|}",
    ].join("\n");

//-- ######################################################## -->
