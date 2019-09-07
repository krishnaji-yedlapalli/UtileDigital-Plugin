/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
         function failureCallback() {
            alert('The current input token is not valid');
        }
        navigator.trellidor.initializer({
            language: 'he',
            fileName: '',
            fileType: '',
            filePath: '',
            templateFilePath: 'file:///storage/emulated/0/Android/he.png',
            token: '566326505834',
            rootContainer: 'body'
        }, failureCallback);

        document.addEventListener('destroyplugin', function (e) {
            navigator.trellidor.removeElement('body');
            var parentTag = document.querySelector('html');
            var body = [
                { tagName: 'body', className: '' },
            ];
            navigator.trellidor.createSetOfElements(body, parentTag);
            // alert('successfully removed the plugin');
            navigator.trellidor.initializer({
                language: 'he',
                fileName: '',
                fileType: 'pdf',
                filePath: '',
                templateFilePath: 'file:///storage/emulated/0/Android/he.png',
                token: '566326505834',

            }, failureCallback);
        }, false);
    }
};

app.initialize();