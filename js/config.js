//-- ######################################################## -->
//-- Configurations ######################################### -->
//-- ######################################################## -->

    geminiBlog.blogName = "Aaron's Blog"; //uncomment the javascript in index.html : header section and remove other stylings
    geminiBlog.archiveTitle = "Archive";

//-- ######################################################## -->

    //info
    var author = "Aaron";

//-- ######################################################## -->

    //global definitions
    geminiBlog.repoBase = "./markdown/"; //remember the ending slash
    geminiBlog.useAsync = true; // enable when being served
    geminiBlog.timeout = 10000; //milliseconds after which an async request 404s

    //divs used in compositing the page
    geminiBlog.containerDiv = "#entries-wrapper";
    geminiBlog.recentDiv = "#recent-posts";
    // geminiBlog.sidebarDiv = "#sidebar-wrapper"; // not used anymore, use archive view instead

    //deprecated
    //var posTop = 0; //px value of top of entry, the page is scrolled to this amount everytime an entry is loaded

    //default post to display
    geminiBlog.freshNumber = 7; //most recent entries to be displayed in default snippetView
    geminiBlog.snippetLength = 170; //characters to display in snippet mode
    geminiBlog.prevnextLinks = true; // previous and next blog post button links at the bottom of each post

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
    //and will be replaced by handleVars()
    //values will be looked up from the dictionary below
    geminiBlog.variablePrefix = "{|";
    geminiBlog.variablePostfix = "|}";

    geminiBlog.variables = [
        //{'name': "variable", 'value': "varValue"},
        {name : "img" , value : "https://wifiextender.github.io/img/file"},
    ];

//-- ######################################################## -->

    //register new entries here
//entries begin with ./, they are replaced by the repoBase url
//this will come handy if CORS is enabled, however rarely


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

    //50x
    var error50x = ["#Encountered a server hiccup.#",
        "####Would you like to return [home][1]?#",
        //"Error code: **{|errorCode|}**",
        "[1]:{|blogHome|}",
    ].join("\n");

    //no more entries found.
    var noMoreEntries = [
        "Sorry, No more entries found.",
    ].join("\n");

//-- ######################################################## -->

    //enable markdown sources to be downloaded
    geminiBlog.markDownloads = true;


    //scale fix
//-- ######################################################## -->

var metas = document.getElementsByTagName('meta');
var i;
if (navigator.userAgent.match(/iPhone/i)) {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
    }
  }
  document.addEventListener("gesturestart", gestureStart, false);
}
function gestureStart() {
  for (i=0; i<metas.length; i++) {
    if (metas[i].name == "viewport") {
      metas[i].content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
    }
  }
}



//-- Bootstrap dropdown menu without jquery

// Navbar and dropdowns
var toggle = document.getElementsByClassName('navbar-toggle')[0],
    collapse = document.getElementsByClassName('navbar-collapse')[0],
    dropdowns = document.getElementsByClassName('dropdown');;

// Toggle if navbar menu is open or closed
function toggleMenu() {
    collapse.classList.toggle('collapse');
    collapse.classList.toggle('in');
}

// Close all dropdown menus
function closeMenus() {
    for (var j = 0; j < dropdowns.length; j++) {
        dropdowns[j].getElementsByClassName('dropdown-toggle')[0].classList.remove('dropdown-open');
        dropdowns[j].classList.remove('open');
    }
}

// Add click handling to dropdowns
for (var i = 0; i < dropdowns.length; i++) {
    dropdowns[i].addEventListener('click', function() {
        if (document.body.clientWidth < 768) {
            var open = this.classList.contains('open');
            closeMenus();
            if (!open) {
                this.getElementsByClassName('dropdown-toggle')[0].classList.toggle('dropdown-open');
                this.classList.toggle('open');
            }
        }
    });
}

// Close dropdowns when screen becomes big enough to switch to open by hover
function closeMenusOnResize() {
    if (document.body.clientWidth >= 768) {
        closeMenus();
        collapse.classList.add('collapse');
        collapse.classList.remove('in');
    }
}

// Event listeners
window.addEventListener('resize', closeMenusOnResize, false);
toggle.addEventListener('click', toggleMenu, false);



//-- Process the search form request
function submit_it() {
    var anchor = document.location.hash.substring(2).toLowerCase();
    if (anchor !== "") {
        geminiBlog.searchView();
    } else {
        document.location.href = "#!search";
    }
};
