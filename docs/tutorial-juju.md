
# OpenIMS Tutorial with Juju-VNFM and Openstack

This Tutorial will demonstrate how to deploy the OpenIMSCore implementation on Openstack using Open Baton and the Juju-VNFM. 

## Requirements

* NFVO (> 3.0.0) 
* Juju and Juju VNFM installed and configured following the [installation-guide][vnfm-juju]  
* An Openstack instance configured and available as PoP
* [OpenIMSCore packages][openimscore-github]

## Configure Juju to work with Openstack

Create a document called *mystack.yaml*. 
Here you will provide the necessary information for Juju to connect to Openstack. 
The content of the file could look something like this:

``` yaml
  clouds:
    mystack:
      type: openstack
      auth-types: [userpass]
      use-floating-ip: true
      use-default-secgroup: true
      regions:
        RegionOne:
          endpoint: http://auth-url:5000/v2.0
```

Values for *auth-type*, *region* or *endpoint* may vary according to your Openstack setup, but *use-floating-ip* and *use-default-secgroup* 
have to be set to true. 

Now we will add the cloud to Juju with the following command: 

``` bash
juju add-cloud mystack {pathToMystackFile}/mystack.yaml
```

The next step is to set credentials for the mystack cloud configuration. Execute the following command and enter the required values. 

``` yaml
juju add-credential mystack
```

## Configure Openstack to work with Juju

Then we also have to configure Openstack to provide an image usable by Juju. 
For this please refer to [this][juju-private-cloud] guide. 

## Bootstrap the environment

Finally we can bootstrap the openstack environment using this command:

``` bash
juju bootstrap obcontroller mystack --config image-metadata-url=$METADATA_URL --config network=$NETWORK_ID --config use-floating-ip=true --config use-default-secgroup=true --bootstrap-series=$SERIES
```

where the $METADATA_URL has to be replaced by the endpoint you created in the previously mentioned guide to configure Openstack. 
If you followed it you should be able to obtain the url by executing 

``` bash
openstack endpoint show product-streams
```

and copying the printed public url. 
It will look something like this: 
http:/\/openstack-url:8080/v1/AUTH_e4f353a5d2184b1fa3f359aaf02abbee/simplestreams/images

The $NETWORK_ID has to be the network's id from Openstack that shall be used. 

And the $SERIES should be set to an Ubuntu series according to the image you want to use. 
By default the Juju-VNFM uses trusty while deploying. 

## Deploy the OpenIMSCore

Now that the setup is ready we can start looking at the actual deployment of the OpenIMSCore. 

Clone the git repository containing the packages from [here][openimscore-github]. 
But before we create tar archives for uploading to the NFVO we have to configure them to work with the Juju-VNFM. 
In every component's directory (bind9, fhoss, scscf, pcscf, icscf) you will find a file containing the VNFD. 
In these VNFDs you have to change the *endpoint* value from generic to juju. 
Furthermore you (currently) have to edit a file in the script folders of icscf, pccs and scscf. 
That are the files *icscf.conf*, *scscf.conf* and *pcscf.conf*. 
In those scripts please comment the lines starting from **pre-start script** until the next **end script**. 

Like this for example: 

``` bash
# pre-start script
# 	exec /opt/OpenIMSCore/bin/icscf.kill.sh
# 	exit 0
# end script
```

Afterwards you can create the packages for each IMS component. 
For icscf for example change into the icscf directory and execute 

``` bash
tar -cf icscf.tar *
```

Start the NFVO and the Juju-VNFM and upload a VimInstance named *vim-instance* with type *test* to the NFVO. 
Then upload the VNFPackages to the NFVO using the Gui or Cli. 
This will also create VNFDs in the NFVO. Download this [NSD][openims-nsd] and replace the VNFD ids with the ones of the stored VNFDs. 
Upload the NSD to the NFVO and launch it. This will create an NSR and deploy the OpenIMSCore on Openstack. 
Since the correct reporting of the deployment's status from the Juju-VNFM to the NFVO is still a future task 
you should not rely on the NSR status shown by the Gui, but check using the *juju status* command. 


[fokus-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/fokus.png
[installation-guide]: https://jujucharms.com/docs/stable/getting-started
[installation-juju-create-container]: https://jujucharms.com/docs/stable/getting-started#create-a-controller
[openbaton]: http://openbaton.org
[openbaton-doc]: http://openbaton.org/documentation
[openbaton-github]: http://github.org/openbaton
[openbaton-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/openBaton.png
[openbaton-mail]: mailto:users@openbaton.org
[openbaton-twitter]: https://twitter.com/openbaton
[tub-logo]: https://raw.githubusercontent.com/openbaton/openbaton.github.io/master/images/tu.png
[juju-flow]: images/juju-flow.png
[juju-store]:https://jujucharms.com/store
[mapping-table]: images/mapping-table.png
[openimscore-github]: https://github.com/openbaton/openimscore-packages/tree/master
[juju-private-cloud]: https://jujucharms.com/docs/devel/howto-privatecloud
[openims-nsd]: http://openbaton.github.io/documentation/descriptors/tutorial-ims-NSR/tutorial-ims-NSR.json
[juju-vnfm-architecture]:images/juju-vnfm-architecture.png
[juju-vnfm-github]:https://github.com/openbaton/juju-vnfm
[nfvo-github]:https://github.com/openbaton/NFVO
[test-plugin-github]:https://github.com/openbaton/test-plugin
[vnfm-juju]: vnfm-juju
