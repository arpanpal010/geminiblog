
---

So long IRC and other plain-text chats.

This post will guide you with the IM installation and off-the-record protocol configuration and usage in order you, your friends and relatives to have private communication.

This is my first post that was inspired from someone else post, in this case it is from Glenn Greenwald and Laura Poitras [website](https://firstlook.org/theintercept/2015/07/14/communicating-secret-watched/). The post there deserves to be decentralised and spread among every chat user.

Let's begin with what off-the-record also known as OTR protocol is.

It is cryptographic protocol that provides encryption and perfect forward secrecy which means that no previous messages will be recovered if you lose or hand over your private key since all messages are encrypted with short-lived key, in contrast the long-lived private key in GPG/PGP will decrypt all previous messages.

It also provides deniable authentication which means that both parties can be confident in the authenticity of the messages, and if any message during the conversation is modified both parties will notice it.

It also provides [Malleable](https://en.wikipedia.org/wiki/Malleability_%28cryptography%29) encryption that allows 3rd party to modify the messages (after the conversation has ended) without knowing their decryption keys, but since there is no verifiable proof (digital signature) they can't link them to the sender and receiver of the messages.

Each session is encrypted separately, and you and your buddy have to be  online at the same time whenever you want to have a chat with him/her, in contrast the ordinary email sending and receiving doesn't require both parties to be online at the same time and if some message is encrypted it will be encrypted with long-lived key.

##The onion router#

As starting point you must have [Tor](https://www.torproject.org/) installed.

##Account creation#

Now you need to create temporary disposable email address in order to create our anonymous chat account. Launch Tor and enter the keywords **temporary email** in the search field, open several of the suggested websites and choose the one that doesn't require from you to enable javascript.

Now you need to choose [some](https://xmpp.net/directory.php) XMPP [server](https://list.jabber.at/) to register your chat account. Don't close the tab with the disposable email address as you will have to copy it's address and paste it in some of the registration page fields of the chosen XMPP server. I chose [this](https://datenknoten.me/registrieren/) one.

##Install Pidgin#

Pidgin is one of the [many](http://wiki.xmpp.org/web/OTR#Client_support) instant messaging clients that supports OTR. Install it followed by the 3rd party OTR plugin, replace **pacman -S** with your distro package manager:

```bash
pacman -S pidgin pidgin-otr haveged
```

**haveged** will speedup the private key creation, as Pidgin is not multi threaded application and it will look like it has stalled while harversting entropy for the keys creation. Start **haveged** before launching Pidgin.

```bash
systemctl start haveged
```

##Torify Pidgin#

We can Torify Pidgin or in other words route our internet traffic over the Tor network. If you closed Tor start it and wait few seconds before launching Pidgin. Now you have to add the newly registered account in Pidgin, replace the input information where neeeded (username, domain, password):

![]({|img|}/pidgin_otr/add_account1.png)
![]({|img|}/pidgin_otr/add_account2.png)

Make sure that **Connection security** is set to **Require encryption**.

![]({|img|}/pidgin_otr/add_account3.png)

Make sure to select the exact same properties.

![]({|img|}/pidgin_otr/add_account4.png)

##Configure OTR#

We need to enable OTR and generate keys for each XMPP account:

![]({|img|}/pidgin_otr/tools_plugins.png)

Click the **Configure Plugin** button.

![]({|img|}/pidgin_otr/configure_otr.png)

Enable **Require private messaging**, now click the **Generate** button.

![]({|img|}/pidgin_otr/generate_key1.png)
![]({|img|}/pidgin_otr/generate_key2.png)

##Add buddies#

Invite your buddies.

![]({|img|}/pidgin_otr/add_buddy1.png)
![]({|img|}/pidgin_otr/add_buddy2.png)

##Authenticate buddy#

If you attempt to start a chat with your buddy, you'll see that Pidgin started a new OTR encrypted session, but your buddy is not authenticated, it could be anyone else than your buddy.

![]({|img|}/pidgin_otr/auth_buddy1.png)

In order to prove that this is really your buddy we have to authenticate him/her. Click on **Unverified** and choose **Authenticate buddy**.

![]({|img|}/pidgin_otr/auth_buddy2.png)

There are 3 ways to authenticate your buddy, but it is less error-prone to select the **Fingerprint verification**, sadly you'll have to ask him/her in person, via email, via phone call or any other method your buddy what is his/hers fingerprint, once verified exchange **I have not** to **I have**.

![]({|img|}/pidgin_otr/auth_buddy3.png)

That was all the steps, you can experiment by creating another XMPP account from another computer or your Android phone. If you have any questions about Pidgin, most of them will be already answered [here](https://developer.pidgin.im/wiki/Protocol%20Specific%20Questions).

##Android instructions#

Install and launch **Orbot**.

![]({|img|}/pidgin_otr/android/connect_to_orbot.png)
![]({|img|}/pidgin_otr/android/orbot_log.png)

Select **Get apps**.

![]({|img|}/pidgin_otr/android/get_other_apps.png)

Click the **ChatSecure** button, install and launch the app.

![]({|img|}/pidgin_otr/android/select_chatsecure.png)

DO NOT skip this step !

![]({|img|}/pidgin_otr/android/chatsecure_master_password.png)

Create the XMPP account.

![]({|img|}/pidgin_otr/android/register_account.png)

Click the **Advanced Account Settings** button, followed by **Chat Encryption** and **Force/Require**.

![]({|img|}/pidgin_otr/android/advanced_account_settings1.png)
![]({|img|}/pidgin_otr/android/advanced_account_settings2.png)
![]({|img|}/pidgin_otr/android/advanced_account_settings3.png)

Accept buddy invitation.

![]({|img|}/pidgin_otr/android/accept_invitation.png)

Authenticate your buddy.

![]({|img|}/pidgin_otr/android/auth_buddy1.png)
![]({|img|}/pidgin_otr/android/auth_buddy2.png)
![]({|img|}/pidgin_otr/android/auth_buddy3.png)

I really like OTR, ditched my email account completly and all of my friends, relatives are using it. Even casual computer users are able to configure it properly. Chatting with unknown persons happens always from disposable accounts.

That was it for the Android too. Happy hacking err chatting.
