# Deploy the Network Service Descriptor
As soon as you onboarded the NSD in the NFVO you can deploy this NSD either by using the dashboard or the CLI.  
This will create a Network Service Record (NSR) and actually launch the Virtual Machines on OpenStack.

## Using the dashboard

This part shows you how to deploy an onboarded NSD via the dashboard. You need to go to the GUI again and navigate to `Catalogue -> NS Descriptors`. Open the drop down menu by clicking on `Action`. Afterwards you need to press the `Launch` button and a window with launching options will appear. Just click on `Launch` again in order to start the deployment of this NSD.

![nsr-deploy][nsr-deploy]

If you go to `Orchestrate NS -> NS Records` in the menu on the left side, you can follow the deployment process and check the current status of the created NSR.

## Using the CLI

You can also use the CLI for deploying existing NSDs. The command needs the ID of the NSD to deploy as an argument. It can be found either by using the dashboard or getting it from the output when onboarding a new NSD as done in the previous step. The command to deploy the previously onboarded NSD looks like shown below:

```bash
$./openbaton.sh NetworkServiceRecord-create f2086f71-4ecf-4ed8-a692-36775ebdfc68 vimmap.json keypair.json conf.json
```

The first argument is the ID of the NSD from which the NSR will be created. The following arguments are files that can contain additional configuration while deploying.
You have to pass these files even if you do not want to pass any configuration like in our case. So just create the three files and fill them with empty json objects/arrays (i.e. *{}* and *[]*).  
The *vimmap.json* and the *conf.json* files should contain this:
```json
{}
```
And the *keypair.json* file this:
```json
[]
```

The execution of this command produces the following output:

```bash
+------------------------ +------------------------------------------------------------- +
| PROPERTY                | VALUE                                                        |
+------------------------ +------------------------------------------------------------- +
| id                      | af12b18b-9aa2-4fed-9b07-bbe1dcad9c98                         |
|                         |                                                              |
| vendor                  | FOKUS                                                        |
|                         |                                                              |
| projectId               | 7bc76eb0-c48c-4328-a234-c779ab54cd2a                         |
|                         |                                                              |
| task                    | Onboarding                                                   |
|                         |                                                              |
| version                 | 1.0                                                          |
|                         |                                                              |
| VLR                     |                                                              |
|                         | id: 7c9996a4-eac8-4862-872b-dfccc4ab1790 - name:  private    |
|                         |                                                              |
| VNF_DEPENDENCY          |                                                              |
|                         | id: 4b0d291e-883b-40e0-b64e-faeb196d2aaf                     |
|                         |                                                              |
| descriptor_reference    | f2086f71-4ecf-4ed8-a692-36775ebdfc68                         |
|                         |                                                              |
| status                  | NULL                                                         |
|                         |                                                              |
| createdAt               | 2016.10.25 at 11:52:04 CEST                                  |
|                         |                                                              |
| name                    | NSD iperf + privateIPs                                       |
|                         |                                                              |
+------------------------ +------------------------------------------------------------- +
```

In order to follow the deployment process you can retrieve information by passing the ID of the deploying NSR to this command:

```bash
$./openbaton.sh NetworkServiceRecord-findById af12b18b-9aa2-4fed-9b07-bbe1dcad9c98


+------------------------ +------------------------------------------------------------------ +
| PROPERTY                | VALUE                                                             |
+------------------------ +------------------------------------------------------------------ +
| id                      | af12b18b-9aa2-4fed-9b07-bbe1dcad9c98                              |
|                         |                                                                   |
| vendor                  | FOKUS                                                             |
|                         |                                                                   |
| projectId               | 7bc76eb0-c48c-4328-a234-c779ab54cd2a                              |
|                         |                                                                   |
| task                    | Onboarded                                                         |
|                         |                                                                   |
| version                 | 1.0                                                               |
|                         |                                                                   |
| VLR                     |                                                                   |
|                         | id: 7c9996a4-eac8-4862-872b-dfccc4ab1790 - name:  private         |
|                         |                                                                   |
| VNFR                    |                                                                   |
|                         | id: ecd372b4-b170-46de-93a4-06b8f03a6436 - name:  iperf-server    |
|                         | id: 20011a5c-73a5-46d6-a7c8-19bfa47de0e6 - name:  iperf-client    |
|                         |                                                                   |
| VNF_DEPENDENCY          |                                                                   |
|                         | id: 4b0d291e-883b-40e0-b64e-faeb196d2aaf                          |
|                         |                                                                   |
| descriptor_reference    | f2086f71-4ecf-4ed8-a692-36775ebdfc68                              |
|                         |                                                                   |
| status                  | ACTIVE                                                            |
|                         |                                                                   |
| createdAt               | 2016.10.25 at 11:52:04 CEST                                       |
|                         |                                                                   |
| name                    | NSD iperf + privateIPs                                            |
|                         |                                                                   |
+------------------------ +------------------------------------------------------------------ +
```

## Conclusions

When all the VNF Records are done with all of the scripts defined in the lifecycle events, the NFVO will put the state of the VNF Record to ACTIVE and when all the VNF Records are in state ACTIVE, also the Network Service Record will be in state ACTIVE. This means that the service is deployed correctly. For learning more about the states of a VNF Record please refer to the [VNF Record state documentation][vnfr-states].

[nsr-deploy]: images/launch-nsd.gif
