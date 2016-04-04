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
    geminiBlog.registerEntry("./encrypted_emails3.md", "Encrypted emails part 2 of 2", "June 02, 2015");
    geminiBlog.registerEntry("./encrypted_emails2.md", "Encrypted emails part 1 of 2", "May 02, 2015");
    geminiBlog.registerEntry("./install_arch_with_full_disk_encryption.md", "Install Arch with full disk encryption", "March 23, 2015");
    geminiBlog.registerEntry("./random_post_2.md", "Random post 2", "March 16, 2015");
    geminiBlog.registerEntry("./dm_crypt_luks.md", "DM-Crypt LUKS encrypted partition", "May 01, 2015");
    geminiBlog.registerEntry("./dns_encryption.md", "DNS encryption", "March 12, 2015");
    geminiBlog.registerEntry("./dns_cache.md", "Dead simple DNS caching", "March 11, 2015");
    geminiBlog.registerEntry("./openbox-to-dwm.md", "Switching from Openbox to dwm", "February 25, 2015");
    geminiBlog.registerEntry("./contributions.md", "Recent contributions", "February 20, 2015");
    geminiBlog.registerEntry("./random_post.md", "Random post", "January 17, 2015");
    geminiBlog.registerEntry("./split_file_and_session.md", "Split large file and", "December 13, 2014");
    geminiBlog.registerEntry("./dust_off_your_pc.md", "Dust off your pc", "November 21, 2014");
    geminiBlog.registerEntry("./running_out_of_ram.md", "Running out of ram ?", "October 11, 2014");
    geminiBlog.registerEntry("./whats_new_2.md", "What's new 2", "September 26, 2014");
    geminiBlog.registerEntry("./mutt.md", "Everyone - ditch Thunderbird !", "August 16, 2014");
    geminiBlog.registerEntry("./gentoo-minimal-installation.md", "Gentoo - minimal installation", "August 09, 2014");
    geminiBlog.registerEntry("./incremental-backups.md", "Incremental backups", "July 24, 2014");
    geminiBlog.registerEntry("./thunderbird_strip_email_headers.md", "Thunderbird - strip your email headers", "July 19, 2014");
    geminiBlog.registerEntry("./gpg-use-stronger-algorithms.md", "GPG - use stronger algorithms", "July 12, 2014");
    geminiBlog.registerEntry("./secure_backups.md", "GPG encrypted backups", "July 05, 2014");
    geminiBlog.registerEntry("./wtf.md", "Why the website went down", "July 02, 2014");
    geminiBlog.registerEntry("./kde-to-openbox.md", "Switching from KDE to Openbox", "June 28, 2014");
    geminiBlog.registerEntry("./fsck-failed.md", "OpenBSD - fsck failed", "June 14, 2014");
    geminiBlog.registerEntry("./best-png-compression-tool.md", "The best PNG compression tool", "June 01, 2014");
    geminiBlog.registerEntry("./encrypted-emails.md", "Thunderbird + GnuPG + Enigmail = encrypted email conversation", "June 08, 2014");
    geminiBlog.registerEntry("./owncloud-with-ssl-and-nginx-version2.md", "Install ownCloud with SSL and Nginx in CentOS (version 3)", "June 05, 2014");
    geminiBlog.registerEntry("./btsync.md", "Bittorrent Sync installation", "May 31, 2014");
    geminiBlog.registerEntry("./install-owncloud-v2.md", "Install Owncloud in CentOS (version 2)", "May 24, 2014");
    geminiBlog.registerEntry("./fix-that-flat-app.md", "Got flat applications, let's make them eyecandy", "May 24, 2014");
    geminiBlog.registerEntry("./tp-link-backdoor.md", "TP-LINK devices with built-in backdoors", "May 18, 2014");
    geminiBlog.registerEntry("./firewall2.md", "TCP/IP stack hardening", "May 17, 2014");
    geminiBlog.registerEntry("./best-compression-tools.md", "The best data compression tool", "May 11, 2014");
    geminiBlog.registerEntry("./vlc-python-screencast-pastbin-server.md", "Pastebin-like server in python, vlc screecast and snapshots", "May 10, 2014");
    geminiBlog.registerEntry("./installing_python_in_android.md", "Install python3 in any android device", "April 30, 2014");
    geminiBlog.registerEntry("./setting_up_plymouth.md", "Setting up Plymouth", "April 12, 2014");
    geminiBlog.registerEntry("./set_grub_theme_and_distro_name.md", "GRUB hacking", "April 11, 2014");
    geminiBlog.registerEntry("./bad_archey.md", "GRUB - dual booting issue", "April 11, 2014");
    geminiBlog.registerEntry("./blogfy-reborn.md", "Blogfy - reborn", "April 06, 2014");
    geminiBlog.registerEntry("./extend_your_wireless_coverage.md", "One house, one router, two floors, weak wireless", "March 30, 2014");
    geminiBlog.registerEntry("./archlinux-installation.md", "Tutorial: Archlinux installation", "February 13, 2014");
    geminiBlog.registerEntry("./change-file-format-to-all-files.md", "Change the file format to all files in a directory", "January 30, 2014");
    geminiBlog.registerEntry("./whats_new.md", "What's new", "January 24, 2014");
    geminiBlog.registerEntry("./new_year_new_challenges.md", "New Year, New Challenges", "January 01, 2014");
    geminiBlog.registerEntry("./xfce-to-kde.md", "Switching from XFCE to KDE without re-install", "October 18, 2013");
    geminiBlog.registerEntry("./two-months.md", "Two months...", "October 10, 2013");
    geminiBlog.registerEntry("./my-project.md", "My little project has been created", "August 25, 2013");
    geminiBlog.registerEntry("./xfce-kwin.md", "Xfce + Kwin = eyecandy combination", "August 10, 2013");
    geminiBlog.registerEntry("./5th-day-with-python.md", "It's 5th day since I started to learn Python", "July 30, 2013");
    geminiBlog.registerEntry("./useful-bash-scripts.md", "Useful dead simple bash scripts", "July 26, 2013");
    geminiBlog.registerEntry("./blog_converted.md", "Blog converted", "July 26, 2013");
    geminiBlog.registerEntry("./fedora-xfce-customization.md", "Fedora XFCE Customization - from ugly to eyecandy", "July 05, 2013");
    geminiBlog.registerEntry("./owncloud-with-ssl-and-nginx.md", "Install ownCloud with SSL and Nginx on your CentOS server", "June 29, 2013");
    geminiBlog.registerEntry("./encrypt-files-with-openssl.md", "Encrypt your files with openssl", "June 28, 2013");
    geminiBlog.registerEntry("./couldnot-resolve-host.md", "CentOS: Couldn't resolve host 'mirrorlist.centos.org'", "June 27, 2013");
    geminiBlog.registerEntry("./honeypot.md", "Catch the bad guys with honeypot", "June 26, 2013");
    geminiBlog.registerEntry("./tor-privoxy-anonymous.md", "Tor + Privoxy = anonymous cached browsing", "June 25, 2013");
    geminiBlog.registerEntry("./set-up-local-proxy-server-to-filter-all-traffic.md", "Set up local proxy server which will filter all the traffic", "June 25, 2013");
    geminiBlog.registerEntry("./install-and-configure-vpn-ssh-tunneling.md", "How to install and configure VPN network and SSH tunneling", "June 06, 2013");
    geminiBlog.registerEntry("./firewall1.md"   , "Firewall - IPTables" , "January 21, 2013");


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
