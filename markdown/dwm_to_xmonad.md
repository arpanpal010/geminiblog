
---

Going back to the future. My first attemp to have xmonad long time ago as my primary window manager failed.

I mentioned half year ago that my first attemp to go with xmonad failed due to the fact that I didn't knew Haskell. I still don't know Haskell, but the experience from dwm encouraged me to give it a try again.

Just to mention that this is my second day in xmonad.

![]({|img|}/dwm-to-xmonad/hello_xmonad.png)

Edited this post on next day to add a new image. The top bar is made of 2 dzen instances, lol.

![]({|img|}/dwm-to-xmonad/hello2_xmonad.png)

It's key bindings are almost identical to the one in dwm, had to verify twice that I am actually running xmonad and not dwm. If you are dwm user or ever used dwm you won't have too many difficulties.

Going down to the code level. I have zero knowledge in Haskell, thus all the configuration code is copied from other people. The only not copied code is my statusbar program that is slightly modified to output it's data to dzen instead.

xmonad is encouraging you to develop unhealty (system) habits. For example it doesn't have top or bottom bar with visible tags, thus forcing you to use external statusbar program that have to be feeded by one more script or your own crafted program. It's so bare bone (not so bare as dwm) by default that you'll be forced to download a whole **xmonad-contrib** package in order to copy and paste code (even if it's 1 line long) found in internet.

Yesterday was all about to find a way to force and shift some programs to particular tags (there is no **tags mask** like in dwm).

While surfing from one website to another one, I found a code that allows me to specify unique layout regarding each tag, so I can have bottom stack layout in one tag, tiled in another one, and monocole in the next one.

I like xmonad despite the language barrier and my inability to expand it the way I want to. It's like dwm's cousin written in Haskell with slightly more features included by default and is forcing you to have a dinner in fast food restaurant instead cooking some healty dinner at home.
