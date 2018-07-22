
          var feedItems = []; //Variable to save the JSON
          var itemIndexHovered = 0; //Index of the item hovered by the arrow keys
          var activeIndex = 0; // Save the index of the selected item
          GetFeed();
          // getting json feed from the server
          function GetFeed()
          {
              $.ajax({
                  url: 'getFeed',
                  type: 'GET',
                  success: function(response) {
                     //console.log("Here is the JSON " + JSON.stringify(response));
                     SetAllComponents(JSON.parse(response));
                  }
              });
          }
          function SetAllComponents(feed)
          {
              // Set title and description
              document.getElementById('title').innerHTML = feed['title'];
              document.getElementById('description').innerHTML = feed['description'];
              feedItems = feed['items'];
              // create list depending on the feed items fetched
              for (var i = 0; i < feedItems.length; i++)
              {
                  var anchorItem = document.createElement("a");
                  // Prevent Mouse Navigation
                  anchorItem.href = "javascript:void()";
                  // Select the first item as selected by default
                  if (i == 0)
                  {
                      anchorItem.className = 'clip-item active';
                      document.getElementById('clip-source').setAttribute('src', feedItems[0]["link"]);
                      document.getElementById('clip').load();
                      document.getElementById('clip-desc').innerHTML = feedItems[0]["contentSnippet"];
                  }
                  else
                  {
                      anchorItem.className = 'clip-item';
                  }
                  var clipTitle = document.createElement("h2");
                  clipTitle.innerHTML = feedItems[i]["title"];
                  var clipDate = document.createElement("p");
                  clipDate.innerHTML = feedItems[i]["pubDate"];
                  anchorItem.appendChild(clipTitle);
                  anchorItem.appendChild(clipDate);
                  // Append all items to the aside element
                  document.getElementById('clip-list').appendChild(anchorItem);
              }
          }
          //setting only the arrow keys (UP/DOWN/Enter) for navigation
          document.onkeydown = checkKey;

          function checkKey(e) {

              e = e || window.event;

              if (e.keyCode == '38') {
                  // up arrow
                  if (itemIndexHovered != 0)
                  {
                      itemIndexHovered -= 1;
                      NavigateThroughList(itemIndexHovered+1);
                  }
              }
              else if (e.keyCode == '40') {
                  // down arrow
                  if (feedItems.length > itemIndexHovered+1)
                  {
                      itemIndexHovered += 1;
                      NavigateThroughList(itemIndexHovered-1);
                  }
              }
              else if(e.keyCode == 13) { 
                  //Enter keycode
                  NavigateToSelectedItem();
              }

          }
          function NavigateThroughList(previousItemIndex)
          {
            var ClipList = document.getElementById('clip-list');
            // it hovered item is greater than four, scroll to the bottom of the list, otherwise scroll to top
            if (itemIndexHovered > 3)
            {
                ClipList.scrollTop = $('#clip-list').height() + ((itemIndexHovered-4)*90);
            }
            else
            {
                ClipList.scrollTop = "0";
            }
            if (activeIndex != previousItemIndex)
            {
                ClipList.childNodes[previousItemIndex].style.backgroundColor = "#FFFFFF";
            }
            if (activeIndex != itemIndexHovered)
            {
                ClipList.childNodes[itemIndexHovered].style.backgroundColor = "#E0E0E0";
            }
          }
          function NavigateToSelectedItem()
          {
              if (feedItems.length > itemIndexHovered)
              {
                  var ClipList = document.getElementById('clip-list');
                  // Remove previous item from being active
                  ClipList.childNodes[activeIndex].classList.remove("active");
                  ClipList.childNodes[activeIndex].style.backgroundColor = "#FFFFFF";
                  activeIndex = itemIndexHovered;
                  // Put the new selected item in active state
                  ClipList.childNodes[itemIndexHovered].classList.add("active");
                  ClipList.childNodes[itemIndexHovered].style.backgroundColor = "#1978FA";
                  // Change the video source according to the selected item link
                  document.getElementById('clip-source').setAttribute('src', feedItems[itemIndexHovered]["link"]);
                  document.getElementById('clip').load();
                  document.getElementById('clip-desc').innerHTML = feedItems[itemIndexHovered]["contentSnippet"];
              }
          }