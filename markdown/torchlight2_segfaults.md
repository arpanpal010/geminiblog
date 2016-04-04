
---

It was a long waiting for native port.

Several months ago the game was finally ported.

After purchasing and downloading the game, it just segfaults while trying to launch it. That's what it shows when the Steam client is ran from the terminal:

**process 32048: arguments to dbus_connection_open_private() were incorrect, assertion "address != NULL" failed in file dbus-connection.c line 2664. This is normally a bug in some application using the D-Bus library. D-Bus not built with -rdynamic so unable to print a backtrace**

My favourite search engine pointed me [https://steamcommunity.com/app/200710/discussions/0/610575007211604445/](https://steamcommunity.com/app/200710/discussions/0/610575007211604445/) among the first page results.

The hint came from the fifth comment **"the SDL2 dbus code was not validating that it found the address before opening the connection in ONE case"**, the shared SDL2 libraries that came with the game was pre-compiled, so I had to [download](https://www.libsdl.org/download-2.0.php) and compile them myself. Download some of the two Source Code archive links. Extract the archive, launch your terminal emulator and compile them:

```bash
./configure --prefix=/tmp --enable-sdl-dlopen --disable-arts --disable-esd --disable-nas --enable-alsa --enable-pulseaudio-shared --enable-video-wayland --disable-rpath
make
make install
cp -r /tmp/lib/* ~/.local/share/Steam/SteamApps/common/Torchlight II/lib64
cp -r /tmp/include/SDL2 /usr/include
chown -R root:root /usr/include/SDL2
```

Now I can see that the game is loading for around 5 seconds, but segfaults again. With no hints what went wrong (it just says bare bore "segmentation fault"), I knew that I have to debug the game with gdb and strace. After running the debugging programs and reading the 1000+ lines long log **carefully**...


    Program terminated with signal SIGSEGV, Segmentation fault.
    #0  0x00007ff9a1d510dd in Ogre::Root::addMovableObjectFactory(Ogre::MovableObjectFactory*, bool) ()
    from /home/frost/.local/share/Steam/SteamApps/common/Torchlight II/lib64/libOgreMain.so.1


The shared library libOgreMain.so.1 crashed because I had no **ogre** 3D engine installed, and it wasn't mentioned anywhere that I have to have ogre installed. Your distro may provide a package for this engine, if not compile it yourself.

Played the first Torchlight release many times through the years and only the good memories about it kept me in the waiting list for the second game and it's native port.
