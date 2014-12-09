#Guide Entry 02: Writing your first entry

Writing the entry is actually your job, so can't help you there mate, however, it is actually quite simple to add an entry to this blog, after you have written it, that is. How it works, is that first you write your entry, in markdown, and keep it in a location (the `entries/` folder) that can be linked. Then you open up the main page of the blog, i.e. `config.js`, and register the link there, basically telling the system that it is an entry. When you navigate to the page, it fetches your entry by the link, converts it into html using {|marked.js|}, and displays it.

#####Lets try that now, you say?

Firstly, locate your project in your filesystem, and navigate to the entries folder, given you would like to keep your entries in there.

* Create a file say, `my-first-post.md`
* Using an editor, put your own content, or the shown below in the file you just made
		[file: $projectroot/entries/my-first-post.md]: <>
		#My first entry
		####December 11, 2014

		Today, I tried out geminiblog.
		Till now it seems pretty chill.

* Then go open up the `config.js` in the editor. And find the section
		//register new entries here
			//e.g register("Entry Filename", "title", "Publication Date(string)", "tags(string)");

* Remove the default entries and add your entry below, assuming by default its in the entries folder,	
(all values except the link and title are optional)

>register("my-first-post.md", "My First Post", "December 11, 2014", "default")

Now open `index.html` in your browser, and see the result.

Yeah its that easy.
Next step, checkout the [markdown example](#markdown-test), or if you already know your way around that,
move on to [configurations](#configuration).
