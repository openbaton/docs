# Marketplace

Open Baton relase 5 works with a public component: the [Marketplace](http://marketplace.openbaton.org/#/). From this page you can browse all the free and open source VNF. You can also download NSDs, images and drivers. In the near future it will be possible for a registered user to upload his own VNF Package, making it in this way public and available to everyone. 

![marketplace-public-front][marketplace-public]

A VNF Package can be downloaded from this page and it can be helpfull as an example when you are writing your own VNF Package. If you want to import VNF Packages and/or NSDs in your own NFVO, you can do it directly via the integrated marketplace page in the NFVO Dashboard. 

![NFVO Marketplace page][nfvo-marketplace-page]

You can onboard the packages simply by clicking on the button, еhey will be automatically downloaded and onboarded, ready to be used for deployment.
You can also download NSD and if the packages are not present in the NFVO but are available on marketplace, 
they will be automatically onboarded from the marketplace. 
**IMPORTANT NOTE**: The NSDs/VNFDs do not specify the PoP where they will be deployed (_vimInstanceName_) since of course the Marketplace is not aware of the PoP currently onboarded on the NFVO. Please remeber to specify during the deployement message where you want to deploy each single VNF. You can also avoid choosing the PoP in the deployment form, but the NFVO will choose randomly between the available onboarded PoPs. 

[nfvo-marketplace-page]:images/nfvo-marketplace-page.png
[marketplace-public]:images/marketplace-front.png
