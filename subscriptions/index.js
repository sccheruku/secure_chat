function Subscription (io) {
  "use strict";
  var connectionInfo = { host: 'localhost', port: 28015 };
  function executeQuery(fn){
    r.connect(connectionInfo, fn);
  };
  // this.SubscribeContactsTable = function SubscribeContactsTable(){    
  //   function subscribeContactsTable(err, conn) {
  //     if(err) { throw err; }
  //     r.table('contacts').changes().run(conn, function(err, cursor){
  //       if(err) { throw err; }
  //       cursor.each(function(err, row){
  //         if (err) throw err;
  //         notifySubscribers(row);
  //       })
  //     })
  //   };
  //   executeQuery(subscribeContactsTable);
  // };
  // function notifySubscribers(row){
  //   console.log(JSON.stringify(row, null, 2));
  //   var defaultRoom = '#/';
  //   var room = '';
  //   var evt = '';
  //   if (!row.new_val){
  //     evt = 'deleted'; 
  //     room = '#/contact/' + row.old_val.id;
  //   }
  //   else if (!row.old_val){
  //     evt = 'created';
  //     room = '#/contact/' + row.new_val.id;
  //   }
  //   else{
  //     evt = 'updated';
  //     room = '#/contact/' + row.old_val.id;
  //   }
  //   io.to(defaultRoom).emit(evt, { data : row });
  //   io.to(room).emit(evt, { data : row });
  // };
};

module.exports.Subscription = Subscription;