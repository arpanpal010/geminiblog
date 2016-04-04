
---

The decision was taken and I want to explore other BSD flavours and or distributions. Past two weeks I've been using FreeBSD, but will I keep it as my daily driver ?

I was using Arch Linux for roughly 2 years and 3 months. But as you might or might not know I wanted more control over what's about to be included in particular program and or library. All of the packages on my system was compiled from source code, but with no control there is no sense in wasting system resources and electricity.

I have even created many patches to patch the PKGBUILD scripts, let me show you just one example:

```diff
--- a/PKGBUILD	2015-02-11 19:00:12.935518000 +0000
+++ b/PKGBUILD	2015-02-11 19:00:17.225520638 +0000
@@ -75,72 +75,6 @@
 
   make
 
-  cd "${srcdir}"/vim-minimal-build
-
-  ./configure \
-    --prefix=/usr \
-    --localstatedir=/var/lib/vim \
-    --with-features=huge \
-    --with-compiledby='Arch Linux' \
-    --disable-gpm \
-    --enable-acl \
-    --with-x=no \
-    --disable-gui \
-    --enable-multibyte \
-    --enable-cscope \
-    --disable-netbeans \
-    --disable-perlinterp \
-    --disable-pythoninterp \
-    --disable-python3interp \
-    --disable-rubyinterp \
-    --disable-luainterp
-
-  make
-
-  cd "${srcdir}"/vim-build
-
-  ./configure \
-    --prefix=/usr \
-    --localstatedir=/var/lib/vim \
-    --with-features=huge \
-    --with-compiledby='Arch Linux' \
-    --disable-gpm \
-    --enable-acl \
-    --with-x=no \
-    --disable-gui \
-    --enable-multibyte \
-    --enable-cscope \
-    --disable-netbeans \
-    --disable-perlinterp \
-    --disable-pythoninterp \
-    --disable-python3interp \
-    --disable-rubyinterp \
-    --disable-luainterp
-
-  make
-
-  cd "${srcdir}"/vim-python3-build
-
-  ./configure \
-    --prefix=/usr \
-    --localstatedir=/var/lib/vim \
-    --with-features=huge \
-    --with-compiledby='Arch Linux' \
-    --disable-gpm \
-    --enable-acl \
-    --with-x=no \
-    --disable-gui \
-    --enable-multibyte \
-    --enable-cscope \
-    --disable-netbeans \
-    --disable-perlinterp \
-    --disable-pythoninterp \
-    --disable-python3interp \
-    --disable-rubyinterp \
-    --disable-luainterp
-
-  make
-
   cd "${srcdir}"/gvim-build
 
   ./configure \
@@ -163,33 +97,12 @@
 
   make
 
-  cd "${srcdir}"/gvim-python3-build
-
-  ./configure \
-    --prefix=/usr \
-    --localstatedir=/var/lib/vim \
-    --with-features=huge \
-    --with-compiledby='Arch Linux' \
-    --disable-gpm \
-    --enable-acl \
-    --with-x=yes \
-    --enable-gui=gtk2 \
-    --enable-multibyte \
-    --enable-cscope \
-    --disable-netbeans \
-    --disable-perlinterp \
-    --disable-pythoninterp \
-    --disable-python3interp \
-    --disable-rubyinterp \
-    --disable-luainterp
-
-  make
 }
 
 check() {
   # disable tests because they seem to freeze
 
-  cd "${srcdir}"/vim-build
+  cd "${srcdir}"/vim-runtime-build
 
   #make test
```

But wait, there is more. There is script that applies the patch:

```bash
THEPKGB='/tmp/vim/PKGBUILD'

sed -i "s/pkgname=('vim-minimal' 'vim' 'vim-python3' 'gvim' 'gvim-python3' 'vim-runtime')/pkgname=('gvim' 'vim-runtime')/g" ${THEPKGB}

sed -i "s/'ruby'//g" ${THEPKGB}
sed -i "s/'python'//g" ${THEPKGB}
sed -i "s/'lua'//g" ${THEPKGB}
sed -i "s/'gpm'//g" ${THEPKGB}

sed -i "s/--enable-gpm/--disable-gpm/g" ${THEPKGB}
sed -i "s/--enable-pythoninterp/--disable-pythoninterp/g" ${THEPKGB}
sed -i "s/--enable-python3interp/--disable-python3interp/g" ${THEPKGB}
sed -i "s/--enable-netbeans/--disable-netbeans/g" ${THEPKGB}
sed -i "s/--enable-perlinterp/--disable-perlinterp/g" ${THEPKGB}
sed -i "s/--enable-luainterp/--disable-luainterp/g" ${THEPKGB}
sed -i "s/--enable-rubyinterp/--disable-rubyinterp/g" ${THEPKGB}


patch ${THEPKGB} 'my_gvim.diff
'```

You think that's too much, you haven't seen my kernel patch, lol.

In 2014 switched and used OpenBSD for about 3 months (because of too much paranoia), but trying to keep it as bleeding edge resulted in copying the ports tree from FreeBSD and working my way to make the **Makefile**s OpenBSD compatible. At the beginning was fun, but at the end became almost full time job leaving me almost no time to enjoy my system. Kinda one man army.

Don't get me wrong, I fall in love with OpenBSD ! All of my servers and firewalls are using it, just not as my daily driver 'cause I'm addicted to the bleeding edge and can't stand next to old software.

Right, so past two weeks I was FreeBSD user. Installed it (the cli way and not with the ncurses installer) with full drive encryption, but grub does not support geli, so I had to give up from encrypted boot partition.

`startx` didn't worked and the Xorg log told me **dri failed to load radeon**, but I already had mesa, xf86-video-ati and their dependencies installed.

After trying everything, from configuring **/etc/X11/xorg.conf** down to recompiling xorg-drivers to include all the possible gpu drivers nothing worked out.

I did remember that in Archlinux's **dmesg** log I've seen **kvm disabled by bios** and this led me to a link that described that in FreeBSD there are two type of radeon drivers: one with KMS enabled and others without KMS.

After removing the current xf86-video-ati drivers and compiled the new xf86-video-ati-ums drivers everything worked flawlessly. Except I couldn't use my wireless keyboard and mouse once X is started.

It turns out that FreeBSD has limited **USB** support, and fades away whenever you plug something that's not wired in first place. This is not a big deal, in the garage I've got PS2 keyboard and mouse. Have to admit that my wireless keyboard and mouse are working fine in OpenBSD.

Several days later decided to purchase a mouse and keyboard that are known to work in FreeBSD, but will talk about this and show them next week in a new blog post.

The FreeBSD developers recommend not to mess with CFLAGS, so in Archlinux you got all the freedom to play around with **/etc/makepkg.conf** but you have no say over what's about to be included in given program, on the other hand in FreeBSD you have limited **make.conf** options that in most of the cases are ignored, but slightly more customizations via `make recursive-config` that has to be repeated minimum 5 times untill all dependencies are configured.

Here is my FreeBSD **make.conf**

```
WITH_PKGNG=yes
WITH_DEBUG=YES
MAKE_JOBS_NUMBER?=3
OPTIMIZED_CFLAGS=YES
BUILD_OPTIMIZED=YES
WITH_CPUFLAGS=YES
WITH_OPTIMIZED_CPUFLAGS=YES
WITHOUT_CUPS=yes
OPTIONS_UNSET=CUPS
NO_SENDMAIL=true
NO_INET6=YES
KERNCONF=BSD GENERIC
VIDEO_DRIVER=ati
FORCE_MAKE_JOBS=yes
CC=clang
CXX=clang++
CPP=clang-cpp
```

In most cases the available `make recursive-config` customizations are "Doc, Debug, Native Language Support". But in ffmpeg, openssl and other big programs you get plenty of choice, except not as much as in Gentoo.

After using it for 2 weeks I was honestly dissapointed of the limited customizations.

Instead screwing up my SSD with FreeBSD on it, plugged some random hard drive and installed Gentoo on it (yesterday). I have to say that Gentoo fits my customization needs perfectly and most importantly is bleeding edge, the stable repos are not so bleeding as in arch though.

When I started X and tried to open several programs to work with everything was **lagging** or opened with huge delay, then looked down to my right and saw the hard drive. It seems I get used to the speed of my SSD too much and have forgotten how slow hard drives are.

There is so much to learn about Gentoo, my first priority is to wrap my head around emerge, pciutils, gentoolkit. The second priority will be to maintain really small number of installed programs and libraries. The third priority will be to use per program USE flags in **/etc/portage/package.use/**. Here is a screenshot of my system:

![]({|img|}/archlinux-freebsd-gentoo/gentoo.png)

The very first kernel I compiled missed my motherboard sensors module, so had to dig little bit further and enable it, so my statusbar program is now able to work properly.

This blog post is not meant to show-off myself or being "slick". All I wanted was more control over the features that are relevant to me. That is why I had to explore different FOSS UNIX systems to find out which OS will serve my **current** needs.

The different operating systems serve different purpose and different people, Arch Linux is binary distribution that doesn't stop you from messing around with **makepkg.conf**, but you have no say over what's included in given program/library.

FreeBSD provides slightly more control over over the features, but not all the time (most of it will be "Doc, Debug, NLS"), lacks make.conf customizations, also lacks USB mouse and keyboard support, the support for wireless hardware is almost none (at least the hardware I tested didn't worked **only in FreeBSD**).

In OpenBSD you get plug-and-forget support out of the box for such hardware, bit outdated packages, small ports tree in comparison to the one in FreeBSD, same limited features as in FreeBSD, but it is proven to be the most secure operating system in the world that also audits it's kernel and base.

Gentoo is the do-it-yourself or should I say break-it-and-fix-it-yourself distribution, and with it you have total control over the features and your init system.
