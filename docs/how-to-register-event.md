# How to register to NFVO Events

The Open Baton platform can be easily extended by writing new external modules that can "react" on some events happening in the system. We already showed how to trigger some operations to the NFVO in the page regarding the [NFVO sdk](nfvo-sdk). In this short tutorial we will show how to write an external module aware of the NFV environment managed by Open Baton. The NFVO sdk already gives the tools for registering to events, so the first steps are the same of the [NFVO sdk](nfvo-sdk) page.

Inside the project folder create a *build.gradle* file as follows:

```gradle
group 'org.openbaton'
version '1.0-SNAPSHOT'

apply plugin: 'java'

repositories {
    mavenCentral()
    /**
     * Only needed for openbaton snapshots dependencies
     */
    maven {
        url 'https://oss.sonatype.org/content/repositories/snapshots/'
    }
}

dependencies {
    compile 'org.openbaton:sdk:5.1.2'
}
```

The main idea behind the event mechanism is that you can register the endpoint where you want to receive the event. We are supporting at the moment two different kind of endpoint, ReST or Amqp. In this example we are using the ReST type. For doing that you need to create _EventEndpoint_ object to be sent to the NFVO using the NFVORequestor. In the project folder create a .java as the following example.

```java
package org.openbaton.event.module.main;

import org.openbaton.catalogue.nfvo.Action;
import org.openbaton.catalogue.nfvo.EndpointType;
import org.openbaton.catalogue.nfvo.EventEndpoint;
import org.openbaton.sdk.NFVORequestor;
import org.openbaton.sdk.NfvoRequestorBuilder;
import org.openbaton.sdk.api.exception.SDKException;
import org.openbaton.sdk.api.rest.EventAgent;

/**
 * Created by lto on 26/09/16.
 */
public class EventModule {

  /**
   * This is the Username used to connect to the NFVO
   */
  private static String obUsername = "admin";
  /**
   * This is the Password used to connect to the NFVO
   */
  private static String obPassword = "openbaton";
  /**
   * This is the Project ID used to connect to the NFVO
   */
  private static String obProjectName = "default";
  /**
   * This must be true if during the NFVO installation the ssl was enabled
   */
  private static boolean isSslEnabled = false;
  /**
   * This is the NFVO Ip
   */
  private static String obNfvoIp = "127.0.0.1";
  /**
   * This is the NFVO port
   */
  private static String obNfvoPort = "8080";

  public static void main(String[] args) {

    NFVORequestor requestor =
        NfvoRequestorBuilder.create()
            .nfvoIp(obNfvoIp)
            .nfvoPort(obNfvoPort)
            .username(obUsername)
            .password(obPassword)
            .projectName(obProjectName)
            .sslEnabled(isSslEnabled)
            .version("1")
            .build();
    /*
      Now the Event Agent needs to be retrieved
     */
    EventAgent eventAgent = requestor.getEventAgent();

    /*
      Define your endpoint
     */
    EventEndpoint eventEndpoint = new EventEndpoint();
    eventEndpoint.setName("MyEvent");
    eventEndpoint.setDescription("My event endpoint");

    /*
      Register to all the event describing the correct instantiation of NSR
     */
    eventEndpoint.setEvent(Action.INSTANTIATE_FINISH);
    eventEndpoint.setType(EndpointType.REST);
    eventEndpoint.setEndpoint("http://127.0.0.1/event/module");

    /*
    It is also possible to filter the event based on the NSR id or the VNFR id. Putting to null means you want to
    receive events for all NSR or VNFR. Please consider that the events refer or to a NSR or to a VNFR so you can
    only filter by NSR id the events that are related to NSR, same for the VNFRs.
     */
    eventEndpoint.setNetworkServiceId(null);
    eventEndpoint.setVirtualNetworkFunctionId(null);

    /*
      Now register the endpoint
     */
    try {
      eventAgent.create(eventEndpoint);
    } catch (SDKException e) {
      e.printStackTrace();
      System.err.println("Got an exception :(");
    }
  }
}

```

As written in the comment, some events are related only to NSR and some other only to the VNFR. The following table describes all the events:

| Event Type (Action)      | NSR or VNFR related (or both) |                                                                                           Description |
|--------------------------|:-----------------------------:|------------------------------------------------------------------------------------------------------:|
| GRANT_OPERATION          |              VNFR             |                                                      The VNFR has finished the GRANT_OPERATION action |
| SCALE_IN                 |              VNFR             |                                                             The VNFR has finished the SCALE_IN action |
| SCALE_OUT                |              VNFR             |                                                            The VNFR has finished the SCALE_OUT action |
| ERROR                    |              Both             |                                                                   The VNFR or NSR went in ERROR state |
| INSTANTIATE              |              VNFR             |                                                          The VNFR has finished the INSTANTIATE action |
| MODIFY                   |              VNFR             |                                                               The VNFR has finished the MODIFY action |
| HEAL                     |              Both             |                  The VNFR has finished the HEAL action or the NSR has completed the healing procedure |
| SCALED                   |              Both             | The VNFR has finished the SCALE_IN or SCALE_OUT action or the NSR has completed the scaling procedure |
| RELEASE_RESOURCES_FINISH |              NSR              |                                                                         The NSR is completely removed |
| INSTANTIATE_FINISH       |              NSR              |                                                                     The NSR is correctly instantiated |
| START                    |              VNFR             |                                                                The VNFR has finished the START action |
| STOP                     |              VNFR             |                                                                 The VNFR has finished the STOP action |

If the event is related to the NSR in the event payload you will receive the NSR object else you will receive the related VNFR. An example of ReST web server based on [Spring](https://spring.io/guides/gs/rest-service/) follows.

```java
package org.openbaton.event.module.rest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import org.openbaton.catalogue.mano.record.NetworkServiceRecord;
import org.openbaton.catalogue.mano.record.VirtualNetworkFunctionRecord;
import org.openbaton.catalogue.nfvo.Action;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/event/module")
public class RestApi {

  private Gson gson = new GsonBuilder().setPrettyPrinting().create();

  @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
  public void receiveEvent(@RequestBody String msg){
    JsonObject event = new JsonParser().parse(msg).getAsJsonObject();
    System.out.println("Received event from NFVO:\n" + event);
    String action = event.get("action").getAsString();
    System.out.println("The action is: " + action);

    switch (Action.valueOf(action)) {
      case INSTANTIATE_FINISH: // this event is only related to NSR
        NetworkServiceRecord networkServiceRecord = gson.fromJson(event.get("payload").getAsJsonObject(), NetworkServiceRecord.class);
        break;
      case START:
        VirtualNetworkFunctionRecord virtualNetworkFunctionRecord = gson.fromJson(event.get("payload").getAsJsonObject(), VirtualNetworkFunctionRecord.class);
        break;
    }

    /**
     * execute the module business logic
     */
  }
}
```
As shown in the example class, the payload is a json string converted to the NetworkServiceRecord or VirtualNetworkFunctionRecord depending on the event. Another note is that the NFVO calls a POST on the specified eventEndpoint (in this case "http://172.0.0.1/event/module"), for that reason the RestApi example class is listening on that path for a POST method.
