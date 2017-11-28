# OpenBaton Command Line Interface (CLI)

The [Openbaton Cli project][openbaton-cli-github] provides a command-line interface, which enables you to use the NFVO's API and send commands to it.

## Install the Openbaton Client

On any OS you can install the Open Baton Command Line Interface using _pip_.

```bash
pip install openbaton-cli
```

after that check you can run:

```bash
openbaton --help

usage: openbaton [-h] [-pid PROJECT_ID] [-u USERNAME] [-p PASSWORD] [-d]
                 [-ip NFVO_IP] [--nfvo-port NFVO_PORT]
                 agent action [params [params ...]]

positional arguments:
  agent                 the agent you want to use. Possibilities are:
                        ['vnfr', 'project', 'user', 'vnfd', 'vnfpackage',
                        'nsr', 'nsd', 'vim']
  action                the action you want to call. Possibilities are:
                        ['list', 'show', 'delete', 'create']
  params                The id, file or json

optional arguments:
  -h, --help            show this help message and exit
  -pid PROJECT_ID, --project-id PROJECT_ID
                        the project-id to use
  -u USERNAME, --username USERNAME
                        the openbaton username
  -p PASSWORD, --password PASSWORD
                        the openbaton password
  -d, --debug           show debug prints
  -ip NFVO_IP, --nfvo-ip NFVO_IP
                        the openbaton nfvo ip
  --nfvo-port NFVO_PORT
                        the openbaton nfvo port
```

## Openbaton Client usage

For simply configure the cli, just download the openbaton.rc file from the top right drop down menu of the NFVO dashboard:

![Download Open Baton RC file][get-rc-file-gif]

After having downaloded the openbaton.rc file, you can source it:

```sh
source openbaton.rc
Insert Open Baton Password:
```

### Run a command:

You are now able to use the CLI by running some commands. For instance:

```sh
openbaton project list

+--------------------------------------+---------+-----------------+
| id                                   | name    | description     |
+======================================+=========+=================+
| 366bf453-2c0a-408a-b895-7687c2a58998 | default | default project |
+--------------------------------------+---------+-----------------+
```

or

```sh
openbaton user list

+--------------------------------------+------------+---------+
| id                                   | username   |   email |
+======================================+============+=========+
| 6a188511-bdcc-429f-8068-69577f1efc58 | admin      |         |
+--------------------------------------+------------+---------+
```

### Activate debug mode:

Simply add the _--debug_ argument

```sh
openbaton --debug project list

DEBUG:org.openbaton.cli.MainAgent:username 'admin'
DEBUG:org.openbaton.cli.MainAgent:project_id '366bf453-2c0a-408a-b895-7687c2a58998'
DEBUG:org.openbaton.cli.MainAgent:nfvo_ip 'localhost'
DEBUG:org.openbaton.cli.MainAgent:nfvo_port '8080'
DEBUG:urllib3.connectionpool:Starting new HTTP connection (1): localhost
DEBUG:urllib3.connectionpool:http://localhost:8080 "POST /oauth/token HTTP/1.1" 200 244
DEBUG:org.openbaton.cli.RestClient:Got token 3cdc2386-0389-4e04-bd95-a040ea47d7d7
DEBUG:org.openbaton.cli.RestClient:executing get on url http://localhost:8080/api/v1/projects/, with headers: {'content-type': 'application/json', 'accept': 'application/json', 'Authorization': u'Bearer
 3cdc2386-0389-4e04-bd95-a040ea47d7d7', 'project-id': '366bf453-2c0a-408a-b895-7687c2a58998'}
DEBUG:urllib3.connectionpool:Starting new HTTP connection (1): localhost
DEBUG:urllib3.connectionpool:http://localhost:8080 "GET /api/v1/projects/ HTTP/1.1" 200 182
DEBUG:org.openbaton.cli.RestClient:Response status is: 200
DEBUG:org.openbaton.cli.RestClient:

+--------------------------------------+---------+-----------------+
| id                                   | name    | description     |
+======================================+=========+=================+
| 366bf453-2c0a-408a-b895-7687c2a58998 | default | default project |
+--------------------------------------+---------+-----------------+
```

### Create vim instance

```sh
openbaton vim create '{ "name":"pop-1", "authUrl":"http://127.0.0.1:5000/v3", "tenant":"my-tenant", "username":"admin", "password":"openbaton", "type":"test", "location":{ "name":"Berlin", "latitude":"52.525876", "longitude":"13.314400" }}'


+-----------+----------------------------------------+
|    key    |                 value                  |
+===========+========================================+
| name      |                                  pop-1 |
+-----------+----------------------------------------+
| projectId |   366bf453-2c0a-408a-b895-7687c2a58998 |
+-----------+----------------------------------------+
| id        |   8a96e0a4-21bd-4ab6-95c5-d2f1db57566d |
+-----------+----------------------------------------+
| active    |                                   True |
+-----------+----------------------------------------+
| authUrl   |               http://127.0.0.1:5000/v3 |
+-----------+----------------------------------------+
| location  |                                 Berlin |
+-----------+----------------------------------------+
| images    |                                   ids: |
|           |                                        |
|           | - 06735dfb-f833-4781-9452-7771e93b0e09 |
|           | - 26009830-76cc-4432-b6cb-486e1bf34068 |
|           | - 1bd8cae8-74d0-4bab-b260-f50187860b52 |
|           | - e3eab43c-8fd8-489b-ae7e-929cca58cb59 |
|           | - 0dcaadc0-7d3d-4eef-9098-91cb695c1403 |
|           | - 02640d29-c2ce-4ae8-a8d2-bd7657a85b91 |
|           | - 2602d0d3-5f39-4601-b595-30870cab1202 |
|           | - 3b3632fe-0de4-4e04-a8e6-0403ee656b9b |
|           | - 64badcf0-f018-4e32-98b6-6bca351eee83 |
|           | - e643d544-6941-46f6-827d-93c820f58e3b |
|           | - 0004a545-db2e-461c-96e9-6373716adc19 |
|           | - bbe16b76-8cc3-4ec9-9a05-5063f8d904bb |
|           | - 03781b76-cc18-489c-9375-dc786b2a14db |
|           | - 76c8f35f-7571-4906-8e33-1252c5776ed6 |
|           | - e20975cf-5c49-49ee-b7f0-331d9e5d4659 |
|           | - 0d39815c-5640-4ebf-be60-8219ec4d04cb |
|           | - 449832f2-5e5c-43d5-ae57-c2bd2110f945 |
|           | - f318791e-cd6e-44d4-9b70-35daa2ba22af |
|           | - beceb57d-b40e-49ac-a90b-2aec68cfa17e |
|           | - 5b441646-f873-4d08-95f2-9018e5fd04dd |
|           | - 194df8a2-a030-472a-a77a-54a8296948bd |
|           | - f2de7984-30a1-4e16-add8-a163545ae90f |
|           | - 986892d3-328e-498f-8dad-2a987467e6c4 |
|           | - b6912a34-2387-43e2-bcf5-84827bea43d2 |
|           | - 1d8e46ee-050c-4972-9850-49ccfa1aae2c |
+-----------+----------------------------------------+
| shared    |                                  False |
+-----------+----------------------------------------+
| type      |                                   test |
+-----------+----------------------------------------+
| networks  |                                   ids: |
|           |                                        |
|           | - 5de7cd50-9c54-43b4-8a3d-98b4512c5c3a |
|           | - b566f31e-f994-4150-a17f-80cdd93b5cbb |
|           | - f7a9384a-810d-493d-802c-8c05c271a0ba |
|           | - 77bf79bb-a0c8-4b21-bb66-b05c3a6694e3 |
|           | - d8b05454-aa5c-40a4-88b2-b9105ed24f65 |
|           | - 8f5f70d1-618c-4370-9794-e5824e57eaa7 |
|           | - 5b9a0daf-151e-489e-89ec-3f107ee47a75 |
|           | - b940ac87-52be-49a6-a77e-92a3392e69b9 |
|           | - 03292dc8-7ef4-44a4-8071-03f4c0336d4f |
|           | - 7f455e53-57b1-4536-bc91-8818ad783192 |
|           | - 1b3f0e0e-4048-4dee-9680-1437eff1fb03 |
|           | - 25ed7294-283b-44f5-94a9-aa77bbaba124 |
|           | - 85739520-adfc-41ae-ae0f-bdfe5b2b76ae |
|           | - 93b6cc9a-2490-4653-8bef-d66635535e92 |
|           | - 52ca2c0d-c00a-4641-af34-4101096847a0 |
|           | - d90adf1a-616a-4339-ab1f-370530092a1a |
|           | - e18b7646-ac6e-41ad-8086-29af3a70370a |
|           | - 80cd74d3-3dcb-450c-bb67-41f694640f12 |
|           | - 4e392df7-5f21-435f-b8b0-7f9534f52eaf |
|           | - 6fb15252-9fab-40f2-8070-1052518a7925 |
|           | - 6969f6d8-de5a-4944-9cdf-3d09f3215876 |
|           | - b391facf-80ff-45fc-bb69-6fa424628417 |
|           | - fe9fba90-1ffd-47ff-a70f-1938bf4c83a2 |
|           | - 4dd96ad8-8fd5-4d68-834b-2f121453049e |
|           | - fb201778-153f-430d-aa72-14799e6bb284 |
+-----------+----------------------------------------+
| hbVersion |                                      1 |
+-----------+----------------------------------------+
```

You can check the entities onboarded, for instance the vim instances:

```sh
openbaton vim list

+--------------------------------------+----------+--------------------------------+----------+------------+
| id                                   | name     | authUrl                        |   tenant |   username |
+======================================+==========+================================+==========+============+
| 6a72cb08-bd6e-4ef6-b4c1-fa06834fc9ac | vim-test | http://192.168.161.121:5000/v3 |          |            |
+--------------------------------------+----------+--------------------------------+----------+------------+
| 8a96e0a4-21bd-4ab6-95c5-d2f1db57566d | pop-1    | http://127.0.0.1:5000/v3       |          |            |
+--------------------------------------+----------+--------------------------------+----------+------------+
```

and then delete what you don't need anymore:

```sh
openbaton vim delete 8a96e0a4-21bd-4ab6-95c5-d2f1db57566d
Executed delete.
```


[overview]:images/nfvo-how-to-use-gui-overview.png
[vimpage]:images/nfvo-how-to-use-gui-vim-page.png
[get-rc-file-gif]:images/get-rc-file.gif
[registeraNewVim]:images/vim-instance-register-new-pop.png
[openbaton-cli-github]:https://github.com/openbaton/openbaton-cli
[linux-install]:nfvo-installation-deb
[homebrew-website]:http://brew.sh


<!---
Script for open external links in a new tab
-->
<script type="text/javascript" charset="utf-8">
      // Creating custom :external selector
      $.expr[':'].external = function(obj){
          return !obj.href.match(/^mailto\:/)
                  && (obj.hostname != location.hostname);
      };
      $(function(){
        $('a:external').addClass('external');
        $(".external").attr('target','_blank');
      })
</script>
