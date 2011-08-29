# weee: Web-Enabled Editor Experiment

weee is a sort of proof-of-concept text editor built using HTML5's
canvas element. It is designed to be extensible with a small core
library and most of the functionality built on top of that library. It
is far from a finished product but the basics are working.

## Usage

Make sure that both jQuery and the weee code are included in your
page. Next add a textarea on your page that you would like to replace
with weee. To activate weee call the `weee()` function of jQuery

### Sample Page

    <html>
      <head>
        <script type="text/javascript" src="jquery.js"></script>
        <script type="text/javascript" src="weee.js"></script>
        <script type="text/javascript">
          jQuery(function(){
            jQuery('.editor').weee();
          });
        </script>
      </head>
      <body>
        <h1>weee Example</h1>
        <textarea class="editor"></textarea>
      </body>
    </html>

## Interacting with weee

weee exposes a number of custom events that can be bound to in order to
add custom functionality to weee:

* 'weee:contentsUpdate'
  This is called with the contents of the editor change.
* 'weee:movePoint'
  This is called when the point moves in the editor. It provides
  attributes for reading the previous and new position
* 'weee:click'
  This is called when the editor's display is clicked on. It provides
  attributes for both the x,y coordinates on the page, and the
  position within the editor that the click occurred.
* 'weee:mousedown'
  This is called when the editor's display is clicked on. It provides
  attributes for both the x,y coordinates on the page, and the
  position within the editor that the click occurred.
* 'weee:mouseup'
  This is called when the mousebutton is released on the editor's
  display. It provides attributes for both the x,y coordinates on the
  page, and the position within the editor that the click occurred.
* 'weee:repaint'
  This is called when the editor's display is repainted


## Design

weee is broken into 3 main parts:

1. Editor
   This is the actual editor model responsible for manipulating the
   text and the point
2. Display
   This is the display which is responsible for painting the contents
   of the editor to the page. It also is responsible for capturing and
   handling mouse events.
3. InputManager
   This manages the input of the keyboard and is where the keybindings
   for the editor are managed and stored.

## Extending

To add additional functionality to weee beyond what is exposed through
the custom events you manipulate the Editor, Display, and InputManager
classes. These are exposed through the following points

* `jQuery.fn.weee.config.Editor`
* `jQuery.fn.weee.config.Display`
* `jQuery.fn.weee.config.InputManager`

Adding fuctions to the prototype of any of these will make those
functions available later. Also, you could replace the full
implementation of any one (or all) of these to make weee work in
complete other ways. Be careful when editing/replacing these classes
as there is a certain interface each object is expected to implement
and violating that contract could result in unexpected behavior.
