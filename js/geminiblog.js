//strict mode
"use strict";

//global vars
var entry_list = []; //holds meta of all entries
var tags_list = []; // all tags as strings

//escape regex
function escapeRegExp(string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
//capitalize first char, lower the rest
function capFirst (text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
//clear all child elements
function clearElements(container) {
	while (container.firstChild) { container.removeChild(container.firstChild); }
}

function hideElement(container) { container.style.opacity = "0";}
function showElement(container) { container.style.opacity = "1";}

//register the .md file as an entry and add it to entry_list
function register(entryUrl, title, pubDate, tags) { //required entryUrl
	var pd = new Date(pubDate) || null;
	title = title || entryUrl;
	var id = title.replace('.md', '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
	//if url begins with ./ replace it with repoBase, else leave as is and consider as full url
	var eurl = (entryUrl.slice(0,2) === "./") ? repoBase + entryUrl.slice(2) : entryUrl;
	var tags_clean = ['untagged'];
	if (tags && tags !== "") { tags_clean=tags.replace(" ", "").split(",");}

	//create the entry object
	var entry = { //properties of each entry
		url : eurl,
		title : title,
		pubDate : pd,
		id : id,
		tags : tags_clean
	};
	entry_list.push(entry);
	console.log("Loaded entry: " + entry.title + " " + pd.toLocaleDateString());

	//push tag in tags_clean to tags_list if not already in
	//accepts tagname= "Unatagged" useful in searching entries without tags
	for (var i = 0; i < tags_clean.length; i++ ) {
		if (tags_list.indexOf(tags_clean[i]) == -1) {
			tags_list.push(tags_clean[i]);
			console.log("added tag: " + tags_clean[i]);
		}
	}
}

//sort list by a key - default: pubDate
function sortEntryList(key, elist, reverse) {
	key = key || "pubDate";
	elist = elist || entry_list;
	reverse = reverse || true; //most recent first
	elist.sort(function(a,b){
		var keyA = a[key];
		var keyB = b[key];
		if (reverse) {return ((keyA < keyB) ? 1 : ((keyA > keyB) ? -1 : 0));}
		else {return ((keyA < keyB) ? -1 : ((keyA > keyB) ? 1 : 0));}
	});
}

//find entries by their id
function getEntryById(eid) {
	if (entry_list.length === 0){ return false;}
	if (entry_list.length === 1){ return entry_list[0];}
	for (var i = 0; i < entry_list.length; i++) {
		//alert(entry_list[i].id + " " + eid);
		if (entry_list[i].id === eid) {return entry_list[i];}
	}
	//alert(entry_list[i].id+" "+eid);
	return false;
}

//find entries by tag
function getEntriesByTag(tag) {
	if (entry_list.length === 0){ return false;}
	if (entry_list.length === 1){ return entry_list[0];}
	var tagged_entries = [];

	for (var i = 0; i < entry_list.length; i++) {
		var entry = entry_list[i];
		if (entry.tags.indexOf(tag) !== -1) {tagged_entries.push(entry);}
	}
	return (tagged_entries.length> 0) ? tagged_entries : false;
}

//XMLHttp wrapper to get entries
function fetchEntryHtml(entry, sliceAmt) {
	var method = "GET";
	var async = use_async;
	var timeout = timeout; //WHAT?
	//alert(entry.url +" "+ method +" "+ async);
	sliceAmt = sliceAmt || 0;

	console.log('fetchEntryHtml(): Fetching url: '+entry.url);

	var xhr;
	var response = error404;
	//detect xhr type
	if (window.XMLHttpRequest) { xhr = new XMLHttpRequest();}
	else { xhr = new ActiveXObject("Microsoft.XMLHTTP"); }

	//timeout
	xhr.timeout = timeout; //defined in config
	xhr.ontimeout = function() { console.error("Request timed out: "+ entry.url); }

	//error
	xhr.onerror = function() {
		console.error(this.statusText);
		response = error404;
		return false;
	}

	xhr.open(method, entry.url, async);
	xhr.overrideMimeType("text/plain; charset=x-user-defined"); //throws syntax error otherwise
	xhr.send(null);

	//alert status if not 200 ||  0 when file://
	console.log('fetchEntryHtml(): Status: '+xhr.status);

	if (xhr.status === 0 || xhr.status === 200 ) { 
		//status 0 for local files kept only for demo //best remove before actual usage
		response = xhr.responseText;
		//console.log(response);
		//return response;
	}
	else if (xhr.status == 404) { response = error404;}
	else if (xhr.status > 500 && xhr.status < 600) { response = error50x;}
	//other errors?

	if (sliceAmt > 0 && response.length > sliceAmt) {
		response = response.slice(0, sliceAmt)+"...";
	}

	//error404
	response = handleVars(response, "title", entry.title);
	response = handleVars(response, "url", entry.url);
	//erro50x
	response = handleVars(response, "errorCode", xhr.status);

	//replace anything in variables dict
	response = handleVars(response);

	var options = md_options || {};
	return (response !== "") ? marked(response, options): false;
}

//markdown to html converter
//function mdConvert(markd, options) {
//	options = options || {}
//	return (markd !="") ? marked(markd, options): false;
//}

//parse and replace variables in entry
function handleVars(markd, vname, vvalue) {
	//read vprefix and vpostfix from config
	//just replace if variable and value provided
	vname = vname || "";
	vvalue = vvalue || null;
	//if name and value provided, do just that
	if (vname !== "" && vvalue != null) {
		var replaceExp=new RegExp(escapeRegExp(vprefix + vname + vpostfix), 'g');
		return markd.replace(replaceExp, vvalue);
	}
	//else try defined variables
	for(var i = 0; i < variables_in_entries.length; i++) {
		vname = variables_in_entries[i].name;
		vvalue = variables_in_entries[i].value;
		var replaceExp=new RegExp(escapeRegExp(vprefix + vname + vpostfix), 'g');
		markd = markd.replace(replaceExp, vvalue);
	}
	return markd;
}

//shows the entries as an unordered list inside a wrapper divp
//get the div by id, create a ul in it, and add links to each entry in the li
function listView(entries, divName, sliceLength) {
	sliceLength = sliceLength || freshNum;
	entries = entries || entry_list.slice(0, sliceLength)
	divName = divName || sidebarDiv;
	var container = document.getElementById(divName);
	clearElements(container);

	var sul = document.createElement("ul");
	sul.setAttribute("class", "list-wrapper");

	for ( var i = 0; i < entries.length; i++) {
		var entry = entries[i];

		var sli = document.createElement("li");
		var sa = document.createElement("a");
		sa.setAttribute("id", entry.id);
		sa.setAttribute("href", "#" + entry.id);

		//add the properties
		//sa.setAttribute("onclick", "showEntry('"+entry.id+"');return false;");
		//sa.setAttribute("onclick", "document.location.href=./#" + entry.id);
		sa.appendChild(document.createTextNode(entry.title));
		sa.setAttribute("title", "Added to "+entry.tags.join("|") + " on " + entry.pubDate);

		sli.appendChild(sa);
		sul.appendChild(sli);
	}
	container.appendChild(sul);
}

//shows a subsection of entries in snippet mode, heading + a partial of content + meta
//in case of archive view slice length =entry_list.length.slice(freshNum)
function snippetView(entries, divName, sliceLength) {
	sliceLength = sliceLength || freshNum;
	entries = entries || entry_list.slice(0, sliceLength)
	divName = divName || containerDiv;
	console.log("snippetView(" + entries.length + ", " + divName + ", " + sliceLength + ")");

	//if only one entry listed, show it in detailsView()
	if (entries.length > 1) {
		var container = document.getElementById(divName);
		//clear container
		clearElements(container);

		for (var i = 0; i< entries.length; i++) {
			var entry = entries[i];
			var html = fetchEntryHtml(entry, snippetLength);

			//only render valid html as snippets, not errors
			if (html) {

				var wrapper = document.createElement("div");
				wrapper.setAttribute("class", "snippet-wrapper");
				wrapper.setAttribute("onclick", "document.location.href = '#" + entry.id + "';");

				//create the head
					var sp = document.createElement("p");
					sp.setAttribute("class", "snippet-head");
					sp.setAttribute("style", "text-align: right;");

					//shead = document.createElement("h4");
					//shead.appendChild(document.createTextNode(entry.title));

					//add the <tags>
					if (entry.tags.length > 0) {
						//sp.appendChild(document.createTextNode(" added to '" + entry.tags.join(", ") + "'"));
						for(var j = 0; j <entry.tags.length; j++ ){
							var ta = document.createElement("a");
							ta.setAttribute("class", "snippet-tags");
							ta.setAttribute("id", entry.tags[j]);
							ta.setAttribute("href", "#" + entry.tags[j]);
							//ta.setAttribute("onclick", "snippetView(getEntriesByTag('" + entry.tags[j] + "'));return false;");
							//ta.setAttribute("onclick", "document.location.href='./#" + entry.tags[j] + "';");
							ta.appendChild(document.createTextNode(entry.tags[j]));

							sp.appendChild(ta);
							//if tags in not the only one, or not the last one add separator
							if (entry.tags.length >1 && j !== entry.tags.length - 1) {sp.appendChild(document.createTextNode(", "));}
						}
					}

					sp.appendChild(document.createTextNode(" \xBB "));

					var sa = document.createElement("a");
					sa.setAttribute("id", entry.id);
					sa.setAttribute("href", "#" + entry.id);

					//add the properties
					//sa.setAttribute("onclick", "showEntry('" + entry.id + "');return false;");
					//sa.setAttribute("onclick", "document.location.href='./#" + entry.id + "';");
					sa.appendChild(document.createTextNode(entry.title));
					//sa.appendChild(shead);

					sp.appendChild(sa);


					//created on <date/month/year>, pubDate considered valid if only year is mentioned
					if (entry.pubDate.getYear()) {
						//var pd = entry.pubDate.getDate();
						//var pm = entry.pubDate.getMonth() + 1;
						//var py = entry.pubDate.getFullYear();
						//sp.appendChild(document.createTextNode(" added on " + pd + "/" + pm + "/" + py));
						sp.appendChild(document.createTextNode(" added on " + entry.pubDate.toLocaleDateString()));
					}

				//element body - heading and mini version of the content
					var sbody = document.createElement("div");
					sbody.setAttribute("class", "snippet-body");
					//sbody.setAttribute("onclick", "showEntry('" + entry.id + "');return false;");
					//sbody.setAttribute("onclick", "document.location.href = '#" + entry.id + "';");
					sbody.innerHTML = html;

					//read more
					var srd = document.createElement("div");
					srd.setAttribute("style", "text-align: right;");
					var sra = document.createElement("a");
					sra.setAttribute("class", "btn-readMore");
					sra.setAttribute("href", "#" + entry.id);
					sra.appendChild(document.createTextNode("Read more"));
					srd.appendChild(sra);

					sbody.appendChild(srd)

				//add the elemeents
				wrapper.appendChild(sbody);
				wrapper.appendChild(sp);

				//separator
				//if (i + 2 < entries.length) {
				//wrapper.appendChild(document.createElement("hr"));
				//}

			}
			container.appendChild(wrapper);
		}
	}
	else { detailsView(entries[0]);}
}

//shows a single post but all of the content
function detailsView(entry, divName) {
	divName = divName || containerDiv;
	console.log("detailsView(" + entry.id + ", " + divName + ")");
	var container = document.getElementById(divName);

	var html = fetchEntryHtml(entry);

	//only render valid html as snippets, not errors
	if (html) {
		//clear container
		clearElements(container);
		var wrapper = document.createElement("div");
		wrapper.setAttribute("class", "details-wrapper");

		//create the head
			var shead = document.createElement("div");
			shead.setAttribute("class", "details-head");
			var sp = document.createElement("p");


			//add the <tags>
			var ss = document.createElement("span");
			ss.setAttribute("class", "tags");
			if (entry.tags.length > 0) {
				//sp.appendChild(document.createTextNode(" added to '" + entry.tags.join(", ") + "'"));
				for(var j = 0; j <entry.tags.length; j++ ){
					var ta = document.createElement("a");
					ta.setAttribute("id", entry.tags[j]);
					ta.setAttribute("href", "#" + entry.tags[j]);
					//ta.setAttribute("onclick", "snippetView(getEntriesByTag('" + entry.tags[j] + "'));return false;");
					//ta.setAttribute("onclick", "document.location.href='./#" + entry.tags[j]+"';");
					ta.appendChild(document.createTextNode(entry.tags[j]));

					ss.appendChild(ta);
					//if tags in not the only one, or not the last one add separator
					if (entry.tags.length >1 && j !== entry.tags.length - 1) {ss.appendChild(document.createTextNode(", "));}
				}
			}

			sp.appendChild(ss);
			sp.appendChild(document.createTextNode(" \xBB "));

			var sa = document.createElement("a");
			sa.setAttribute("id", entry.id);
			sa.setAttribute("class", "link");
			sa.setAttribute("href", "#" + entry.id);

			//add the properties
			//sa.setAttribute("onclick", "showEntry('" + entry.id + "');return false;");
			//sa.setAttribute("onclick", "document.location.href='./#" + entry.id + "';");
			var title = (entry.title.length > 25)? entry.title.slice(0, 25) + "..."  : entry.title;
			sa.appendChild(document.createTextNode(title));
			//sa.appendChild(shead);

			sp.appendChild(sa);

			//created on <date/month/year>, pubDate considered valid if only year is mentioned
			if (entry.pubDate.getYear()) {
				//var pd = entry.pubDate.getDate();
				//var pm = entry.pubDate.getMonth() + 1;
				//var py = entry.pubDate.getFullYear();
				//sp.appendChild(document.createTextNode(" added on " + pd + "/" + pm + "/" + py));
				sp.appendChild(document.createTextNode(" on " + entry.pubDate.toLocaleDateString()));
			}
			shead.appendChild(sp);

		//element body - heading and mini version of the content
			var sbody = document.createElement("div");
			sbody.setAttribute("class", "details-body");
			//sbody.setAttribute("onclick", "showEntry('" + entry.id + "');return false;");
			//sbody.setAttribute("onclick", "document.location.href='./#" + entry.id + "';");
			sbody.innerHTML = html;

		//add the elemeents
		wrapper.appendChild(shead);
		wrapper.appendChild(sbody);

		//add to container
		container.appendChild(wrapper);
	}
	scroll(0,posTop); //scroll to top after the entry loads, set the px value in config depending on header height
}

//shows a snippetView of archived(old entries that are not shown in listview or default snippetView) entries.
function showArchive(divName) {
	divName = divName || containerDiv;
	var container = document.getElementById(divName);
	clearElements(container);

	//if (entry_list.slice(freshNum).length > 0 ) { snippetView(entry_list.slice(freshNum));}
	if (entry_list.length > 0 ) {
		//listView(entry_list, containerDiv);

		for (var i = 0;i<entry_list.length; i++) {
			var entry = entry_list[i];
			var wrapper = document.createElement("div");
			wrapper.setAttribute("class", "archive-wrapper");
			//wrapper.setAttribute("style", "text-align: left;");
			wrapper.setAttribute("onclick", "document.location.href = '#" + entry.id + "';");

			//date of entry
			var dt = document.createElement("span");
			dt.setAttribute("class", "date");
			var pd = entry.pubDate; //add 0 to single digit month/days
			//var m = ((pd.getMonth() + 1) > 9) ? (pd.getMonth() + 1) : "0" + (pd.getMonth() + 1);
			//var d = (pd.getDay() > 9) ? (pd.getDay()) : "0"+(pd.getDay());
			//dt.appendChild(document.createTextNode(pd.getFullYear() + "/" + m + "/" + d));
			dt.appendChild(document.createTextNode(pd.toLocaleDateString()));

			//entry title link
			var sa = document.createElement("a");
			sa.setAttribute("class", "link");
			sa.setAttribute("id", entry.id);
			sa.setAttribute("href", "#" + entry.id);

			//add the properties
			//sa.setAttribute("onclick", "showEntry('" + entry.id + "');return false;");
			//sa.setAttribute("onclick", "document.location.href = '#" + entry.id + "';");
			sa.appendChild(document.createTextNode(entry.title));

			//add the <tags>
			if (entry.tags.length > 0) {
				var tags = document.createElement("span");
				tags.setAttribute("class", "tags");
				//sp.appendChild(document.createTextNode(" added to '" + entry.tags.join(", ") + "'"));
				for(var j = 0; j <entry.tags.length; j++ ){
					var ta = document.createElement("a");
					ta.setAttribute("class", "snippet-tags");
					ta.setAttribute("id", entry.tags[j]);
					ta.setAttribute("href", "#" + entry.tags[j]);
					//ta.setAttribute("onclick", "snippetView(getEntriesByTag('" + entry.tags[j] + "'));return false;");
					//ta.setAttribute("onclick", "document.location.href='#" + entry.tags[j] + "';");
					ta.appendChild(document.createTextNode(entry.tags[j]));
					tags.appendChild(ta);
					//if tags in not the only one, or not the last one add separator
					if (entry.tags.length >1 && j !== entry.tags.length - 1) {tags.appendChild(document.createTextNode(", "));}
				}
			}

			wrapper.appendChild(dt);
			wrapper.appendChild(document.createTextNode('\xBB')); //separator
			wrapper.appendChild(sa);
			//wrapper.appendChild(document.createTextNode(" - "));
			wrapper.appendChild(tags);

			container.appendChild(wrapper);
		}

	}
	else { //show message that no more entries exist
		//reuse snippt css here
		var wrapper = document.createElement("div");
		wrapper.setAttribute("class", "snippet-wrapper");

		//set message
		wrapper.innerHTML = mdConvert(noMoreEntries);

		container.appendChild(wrapper);
	}
}

//show list of tags
function showTags(divName) {
	if(tags_list.length > 0) {
		divName = divName || containerDiv;
		var container = document.getElementById(divName);
		//clear container
		clearElements(container);

		//
		var tagcontainer = document.createElement("div");
		tagcontainer.setAttribute("class", "tags-container");

		for(var i = 0; i< tags_list.length; i++) {
			var tag = tags_list[i];
			var tp = document.createElement("p");
			tp.setAttribute("class", "tags-wrapper");
			tp.setAttribute("onclick", "document.location.href = '#" + tag + "';");

			var ta = document.createElement("a");
			ta.setAttribute("href", "#" + tag);
			ta.appendChild(document.createTextNode(tag));

			var entries = getEntriesByTag(tag);

			tp.appendChild(ta);
			//tp.appendChild(document.createTextNode(" - " + entries.length));
			tp.appendChild(document.createTextNode(entries.length));
			//entry or entries
			tp.appendChild(document.createTextNode( (entries.length > 1 ) ? " entries." : " entry."));

			tagcontainer.appendChild(tp);
		}
		container.appendChild(tagcontainer);
	}
}
//assign links to contact icons or hide them
function contactLinkMaker() { //contactLinks defined in config
	for(var i = 0; i < contactLinks.length; i++) {
		var cl=contactLinks[i];
		//console.log(cl);
		if(document.getElementById("contact_" + cl.name)) {
			var el=document.getElementById("contact_"+cl.name);
			var id=cl.id || '';
			var url=cl.url || '';
			if(url || id) { // || url) {
				el.setAttribute("href", url + id);
				el.setAttribute("title", capFirst(cl.name) + ": " + id);
				el.style.display="inline-block";
			}
			else {el.style.display="none";}
		}
	}
}

//-- ######################################################## -->

//setup = these functions are run after the page finishes loading
function initialize () {
	//sort the lists
	sortEntryList();
	tags_list.sort();

	//populate sidebar with a list of entries - comment this out if sidebar is hidden
	//listView();
	//if anchored - show entry maching id with anchor or tag matching anchor or default page
	var anchor = document.location.hash.substring(1).toLowerCase();
	if(anchor !== ""){
		//archive
		if (anchor === "archive") {
			//return listView(entry_list, "entries-wrapper");
			return showArchive();
		}
		//tags
		else if(anchor === "tags") { return showTags();}
		//anchor = entry id
		else if (getEntryById(anchor)) {
			return detailsView(getEntryById(anchor));
		}
		//anchor = tag
		else if (getEntriesByTag(anchor)) {
			return snippetView(getEntriesByTag(anchor));
		}
		//default - snippetview of fresh entries
		//else {
		//	return snippetView();
		//}
	}
	//default - snippetview of fresh entries
	return snippetView();
}

//!-- ######################################################## -->

//fire initialize() after page load
window.onload = initialize;
//fire initialize() if the anchor changes
window.onhashchange = initialize;

