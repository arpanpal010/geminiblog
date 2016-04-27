
---

We are going to create a custom local repo with signed packages. I compile some of the packages on my system with the features that are relevant to me.

For example I don't want vim to be compiled with support for gpm, python2, python3, ruby or lua. That's why whenever I compile this package I would like to have a custom repo to keep it there. The package signature will verify that it wasn't modified.

You must have gpg key, if not visit [this](https://wifiextender.github.io/post/encrypted_emails2/) post to learn how.

Export the public key in order to import it in the archlinux keyring.

```bash
gpg --export --armor --output my_pub_key.asc user@email.com
```

In order to avoid [this](https://bugs.archlinux.org/task/42798) bug we have to run this command:

```# dirmngr < /dev/null```

Add your **my_pub_key.asc** to the archlinux keyring, sign it and refresh the keys. Replace **12345678** with your public key:

```bash
pacman-key --add my_pub_key.asc
pacman-key --lsign-key 12345678
pacman-key --refresh-keys
```

Create the folder where the custom repo database, packages and their signatures will reside:

```bash
mkdir -p -m 755 /var/custompkgs
```

Add the custom repo above than the others. Also make sure that **pacman** only accepts signed packages.

![]({|img|}/custom_repo/pacmanconf.png)
![]({|img|}/custom_repo/siglevel.png)

Type in your public key and packager name:

![]({|img|}/custom_repo/makepkg.png)

Let's compile an image viewer.

```bash
pacman -S abs
abs
cp -r /var/abs/community/sxiv /tmp
cd /tmp/sxiv
makepkg --clean --install --force --syncdeps --rmdeps --sign
```

Once the program is compiled you'll be asked to enter your gpg private key password, so **makepkg** will be able to create detachable signature.

Add the package and it's signature to your own repo:

```bash
cp -r *.pkg.tar.xz{,.sig} /var/custompkgs
cd /var/custompkgs
repo-add custom.db.tar.gz sxiv-*.tar.xz
pacman -Syu
```

Re-install the package if you want to verify that your own repo is working.

```bash
pacman -Rsnc sxiv
rm -rf /var/cache/pacman/pkg/sxiv-1*
pacman -S sxiv
pacman -Ss sxiv
pacman -Qi sxiv
```

That was it.
