import Iter "mo:base/Iter";
import Text "mo:base/Text";
import List "mo:base/List";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
shared(install) actor class Weibo() = this {
  public type Message = {
    author: Text;
    text: Text;
    time: Time.Time;
  };

  public type Blogger = {
    id: Principal;
    name: Text;
    sex: Text;
    birth:Text;
    city:Text;
  };

  public type Microblog = actor{
    follow: shared(Text) -> async ();
    follows: shared query () -> async [Text];
    post: shared (Text) -> async ();
    getName:() -> async(Blogger);
    setName: (profile:Blogger) -> async();
    posts: shared query (since:Time.Time) -> async [Message];
    timeline: shared (since:Time.Time) -> async [Message];
  };
  let installer = install.caller;

  stable var name:Text = "";

  stable var myProfile:Blogger = {
      id = installer;
      name="anonymous";
      sex="male";
      birth="2000-1-1";
      city="beijing";
  };



  public shared query func getInstaller():async Principal{
    installer;
  };

  public shared (msg) func setName(myname:Text):async(){
    //assert(installer == msg.caller);
    name := myname;
  };

  public shared query func getName():async(Text){
    name;
  };

    public shared (msg) func setProfile(profile:Blogger):async(){
    //assert(installer == msg.caller);
    myProfile := profile;
  };

  public shared query func getProfile():async(Blogger){
    myProfile;
  };

  stable var following: List.List<Principal> = List.nil();

  public shared func follow(id: Text):async() {
    following := List.push(Principal.fromText(id), following);
  };

  func id2Text(id:Principal):Text{
    Principal.toText(id);
  };

  public shared query func follows(): async [Text]{
    let arrayFollowed:[Principal] = List.toArray(following);
    Array.map<Principal,Text>(arrayFollowed, id2Text);
  };

  stable var messages: List.List<Message> = List.nil();

  public shared query (msg) func getId(): async Text{
    Principal.toText(msg.caller);
  };
  
  public shared (msg) func post(text:Text): async() {
    messages := List.push({text=text;time=Time.now();author=name}, messages);

  };

  public shared query func posts(since: Time.Time): async [Message] {
    var filter_result:List.List<Message> = List.nil();
    for (msg in Iter.fromList(messages)){
      if (msg.time >= since){
        filter_result := List.push(msg, filter_result);
      }
    };
    List.toArray(filter_result);
  };

  public shared func timeline(since:Time.Time): async [Message]{
    var all: List.List<Message> = List.nil();
    for (id in Iter.fromList(following)){
      let canister: Microblog = actor(Principal.toText(id));
      let msgs = await canister.posts(since);

      for (msg in Iter.fromArray(msgs)){
          if (msg.time >= since){
            all := List.push(msg, all);
          };
      }
    };

    List.toArray(all);
  }

};