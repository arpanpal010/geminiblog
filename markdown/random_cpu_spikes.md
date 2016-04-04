
---

At random intervals one of my cpu cores is hogged for a few seconds. Re-compiling Xorg, the kernel, systemd, and several other packages didn't solved the issue.

Instead staring at my screen (to watch my statusbar) I just crafted one-liner command to do the job for me. Note that the following command includes only the most important part that does all the heavy lifting. I'm sure you know how to use conditional loops.

```bash
ps -eo pcpu,comm | gawk '{ if ($1 > 10.1) { print $1,$2 } }'
```

The above one-liner lists all currently running processes and formats the output to include only the cpu usage and the process name, then it is piped to [gawk](https://www.gnu.org/software/gawk/manual/gawk.html) where we check if the cpu usage value is bigger than the specified **10.1**, if it's true we output the cpu usage and the process name.

The command was executed and I didn't touched my computer afterwards in order to reduce the load and false positives. 4 hours later the one-liner command catched the sneaky bastard.

![]({|img|}/cpu_spikes/random_spikes.png)

So where **mandb** came from ?

```bash
pacman -Qo mandb
```

The package that contains it is called **man-db**, listing it's content revealed even more information:

```bash
pacman -Ql man-db
```

It revealed that there was auto-starting systemd units called **man-db.service** and **man-db.target**. Now had to verify that those units are running, if so then nuke them.

```bash
systemctl list-units | grep man
systemctl show -p WantedBy -p RequiredBy man-db.service
systemctl show -p WantedBy -p RequiredBy man-db.target
ln -s /dev/null /etc/systemd/system/man-db.service
ln -s /dev/null /etc/systemd/system/man-db.target
```

The unit files in **/usr/lib/systemd/system/** can be overridden by the one in **/etc/systemd/system/**. The symlink from **/dev/null** ensures that those units will never ever start again, literary.

Whenever I decide to re-index the installed **man** pages all I have to do is run `sudo mandb`.

It was really creepy not knowing what causes those random cpu spikes, at least the paranoid in me didn't screamed **HACKED** at the beginning this time.
