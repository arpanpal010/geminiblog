
---

We learned how to perform a full (root) disk encryption couple posts ago.

Today we will take some steps in order to encrypt the boot loader partition.

This post was meant to be published in July, but something happend and I cannot go in much more details right now. Let's hope that I will be able to publish the next one in August.

The boot loader encryption provides another layer of complexity in order to boot your encrypted root partition.

Let me show you what we are going to achieve: pc power on -> [POST](https://en.wikipedia.org/wiki/Power-on_self-test) -> encrypted boot loader -> os menu -> load the kernel into memory then surrender yourself to systemd -> encrypted root partition.

The process of moving the boot partition on external media and encrypting it, ensures that no one will be able to alter, tamper or do other [evil](https://twopointfouristan.wordpress.com/2011/04/17/pwning-past-whole-disk-encryption/) things with your boot partition in order to extract your root encryption keys. Your current boot partition resides on your drive, and an adversary can modify the boot loader as well as the initramfs. All of this can happen while your computer is on and connect to the internet (if you've been targeted).

Even if you lose your external media, you can always chroot your root partition, encrypt the new external media and regenerate the boot partition files. That's what we are going to do right now.

I have booted the latest Arch Linux image written to a USB stick in order to chroot my encrypted root partition.

Off-topic: The microsd card used with adapter ensures that the card contacts won't be wearing out, thus allowing you to use all the read and write cycles guaranteed by the card manufactor. You can always swap the adapter if it's contacts are wearing out. Buy microsd card that is at least rated as class 6, don't hesitate if you can afford class 10.

Once you booted your distro image from external media, the very first thing to do is deleting the current **/boot** partition. `/dev/sda` is my primary drive where the boot and root partitions reside.

```bash
fdisk /dev/sda
p     # list the partitions
d     # request partition deletion
1     # you'll be asked "partition number: "
w     # write the changes and exit
```

Erase your microsd card or whatever external media you will be using to move the **/boot** partition to. It's `/dev/sdb` in my case.

```bash
shred --verbose --random-source=/dev/urandom --iterations=3 /dev/sdb
```

Create new partition table:

```bash
cfdisk /dev/sdb
```

![]({|img|}/archlinux-luks/dos-label.png)

Create the new boot loader partition:

```# New-> Partition Size: auto-detected -> primary -> Bootable```

Write the changes and exit from cfdisk. Now unlock your LUKS encrypted root partition, mount it and chroot. We will use the "first in, last out" approach, so it is less likely to "unmount" your partitions the wrong way. `/dev/sda2` is my encrypted root partition.

```bash
cryptsetup open --type luks /dev/sda2 cryptroot
mount -t ext4 /dev/mapper/cryptroot /mnt
arch-chroot /mnt   # use 'chroot' alternatively
```

Encrypt and mount the microsd card partition `/dev/sdb1`, notice the number **1** at the end.

```bash
cryptsetup --verbose --cipher aes-xts-plain64 --key-size 512 --hash sha512 --iter-time 5000 --use-random luksFormat /dev/sdb1
cryptsetup open --type luks /dev/sdb1 boot
mkfs.ext4 /dev/mapper/boot
rm -rf /boot/*
mount -t ext4 /dev/mapper/boot /boot
```

Edit **GRUB_PRELOAD_MODULES** in `/etc/default/grub`, let's repeat once again - edit this GRUB variable/option/parameter.

```# GRUB_PRELOAD_MODULES="crypto cryptodisk luks part_gpt part_msdos"```

Now add the following line in `/etc/default/grub`

```# GRUB_ENABLE_CRYPTODISK=y```

Re-install your distro kernel to regenerate the vmlinuz-linux and initramfs images.

```bash
pacman -S linux  # in my case
```

Install grub and save it's configuration, `/dev/sdb` is my microsd card:

```bash
grub-install --recheck /dev/sdb
grub-mkconfig --output /boot/grub/grub.cfg
```

If your distribution handles the initramfs image creation separately, use **mkinitcpio** or other program of your choice:

```bash
mkinitcpio -p linux
```

That was it, we are done. Unmount the boot partition and close the device:

```bash
umount -R /boot
cryptsetup close boot
exit  # exit from chroot
```

Unmount the root partition, close it's device and reboot.

```bash
umount -R /mnt
cryptsetup close cryptroot
systemctl reboot
```

Instead exchanging the boot device priority settings in your bios/uefi/efi, there should be some key (F8 in my case) to bring the boot device menu. Select your external media, press enter and you'll be asked to enter your **/boot** LUKS passphrase in order to continue.

From now on, when there is a new kernel release and your distro package manager prompt you to update it, you should unlock this external media and mount it firstable.

Your computer is now 100% encrypted, but your **/boot** external media is 99.9% encrypted, because the first 2048kb in there aren't encrypted (bios_grub flag/label).

As I said at the beginning of this post, the boot loader encryption is complex and requires you to type 2 passwords instead 1, the best of all is that you don't have to carry your external media with you all the time or keep it under your pillow. You also learned that you can regenerate the **/boot** partition and the files in it if you lose them. If you use custom theme (which I do) then you'll have to backup those files separately.

Comment in the **/boot** line in `/etc/fstab`, alternatively you can add **noauto** in there if you want to pull out your external media once the kernel is loaded into memory.

Head over to this [HOWTO](http://www.tldp.org/HOWTO/html_single/Unix-and-Internet-Fundamentals-HOWTO/) until I get back in August.
