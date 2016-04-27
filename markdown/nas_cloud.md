
---

So you've read or watched some video regarding home NAS or cloud solution and want to give it a try. After all your privacy matters more than your pride, and Google doesn't cut the mustard.

You have to define what's the purpose of this home NAS/cloud.

Are you going to cram all of your smartphones, tablets, laptops, desktop pc files in this NAS/cloud and rely on it as long-term backup station ? If so, how often are you going to access those files ? Do you have redundant storage of those files or raid mirroring ? Are you prepared for power outages, drive failure, sacrifice your home space where the device will reside ? What happens next if someone is able to steal this device while you are not at home ? Have you considered the yearly impact on your electricity bill (300 watt server under full system load / 1000 + 24 * cost per kWh * 365) == $524 if [[ "${cost_per_kWh}" == "20cent" ]]; then per_month="$43" fi ?

The above one was just single example, you have to plan wisely and find out why you need this home NAS/cloud yourself. Also the simple and smaller your requirments are, the easier will be for you to mitigate any issues.

Nowadays the online storage comes at no cost up to **some** cost, depending on your needs.

What follows next is that I am going to show you how to have long-term backup NAS and cloud for free, the catch is that you'll have to rely on online [owncloud provider](https://owncloud.org/providers/). This way you'll eliminate all the hassle listed in the above example, but still be able to control your cloud the way you want to.

I've chosen the blaucloud provider for this blog post, if your storage needs require more than 2GB, please be my guest and pick other provider with more space.

The administration page is great, it shows me that by default the server-side encryption plugin is enabled and I can enable/disable several more (up to 10) plugins, that's out-of-the-box.

The interesting part is that you can attach other online storage provider, you'll find more in "external storage" section.

After spending some time in your owncloud, it is pretty much inavoidable to notice the word **WebDAV**. Head over to [wikipedia](https://en.wikipedia.org/wiki/WebDAV) to learn what WebDAV is.

So let's get started. Install **davfs2**. After that add your $USER to the davfs2 group:

```bash
gpasswd -a YOUR_USER davfs2
groups YOUR_USER
```

It is good idea to avoid using system wide davfs2 configuration. Create the davfs2 folder where you'll store the configuration file and SSL certificate.

```bash
mkdir -p --mode=700 ~/.davfs2
cp -r /etc/davfs2/{secrets,davfs2.conf} ~/.davfs2
chown YOUR_SYSTEM_USER:YOUR_SYSTEM_USER ~/.davfs2/{secrets,davfs2.conf}
chmod 600 ~/.davfs2/{secrets,davfs2.conf}
```

Append your owncloud provider webdav page followed by your account and password in **~/.davfs2/secrets**.

```https://YOUR_ACCOUNT.blaucloud.de/remote.php/webdav/ YOUR_ACCOUNT YOUR_ACCOUNT_PASSWORD```

Create a directory where the SSL certificate will reside, after that download the certificate, then tell **davfs2.conf** where the certificate resides.

```bash
mkdir -p --mode=700 ~/.davfs2/certs
openssl s_client -connect YOUR_ACCOUNT.blaucloud.de:443 -showcerts &lt;/dev/null 2&gt;/dev/null|openssl x509 -outform PEM > ~/.davfs2/certs/cert.pem
chmod 600 ~/.davfs2/certs/cert.pem
# Uncomment trust_server_cert and point the location of cert.pem
sed -i 's|# trust_server_cert|trust_server_cert ~/.davfs2/certs/cert.pem|g' ~/.davfs2/davfs2.conf
```

In order your "NAS" to be network attached, it have to be mounted. Now you'll have to edit your **/etc/fstab** and specify the mount point location.

```https://YOUR_ACCOUNT.blaucloud.de/remote.php/webdav/ /media/NAS_cloud davfs user,rw,noauto,file_mode=600,dir_mode=700 0 0```

Now create this directory and set some permissions:

```bash
mkdir -p --mode=700 /media/NAS_cloud
chown YOUR_SYSTEM_USER:YOUR_SYSTEM_USER /media/NAS_cloud
```

Open up your file manager and you'll see the NAS_cloud mount point, click on it and you are ready to rock.

No matter what solution you choose, don't store your files without some sort of encryption.

I was huge LUKS fan, but since my very last blog post I went working and travelling across many European countries carrying only my smartphone me, and then my LUKS passion started to chill. I ended up writing [skilcrypt](https://github.com/wifiextender/skilcrypt), basically EncFS utilizing GPG instead.

Came to the conclusion that the rusty GPG fellow is cross platform, water err tamperproof, doesn't require pre-allocated space in first place. Wrote 3 skilcrypt scripts, two of which are trying to mimic EncFS as much as possible, while remaining smartphone friendly (no filename mangling, avoiding to "move the problem" citing EncFS configuration file).
