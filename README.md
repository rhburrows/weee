# S2E

S2E is a javascript text editor designed to be easy to use and
extend. S2E is built on top of jQuery and requires it to be present to
function. Currently it has only been tested with Chrome on a Mac and
jQuery 1.6.1

## Getting S2E

TODO

## Usage

Make sure that both jQuery and the S2E code are included in your
project. Next add a textarea on your page that you would like to
replace with the S2E editor. To activate S2E call the `s2e()` function
of jQuery

### Sample Page

    <html>
      <head>
        <script type="text/javascript" src="jquery.js"></script>
        <script type="text/javascript" src="s2e.js"></script>
        <script type="text/javascript">
          jQuery(function(){
            jQuery('.editor').s2e();
          });
        </script>
      </head>
      <body>
        <h1>S2E Example</h1>
        <textarea class="editor"></textarea>
      </body>
    </html>

## Interacting with S2E

S2E exposes a number of custom events that can be bound to in order to
add custom functionality to S2E:

* 's2e:contentsUpdate'
  This is called with the contents of the editor change.
* 's2e:movePoint'
  This is called when the point moves in the editor. It provides
  attributes for reading the previous and new position
* 's2e:click'
  This is called when the editor's display is clicked on. It provides
  attributes for both the x,y coordinates on the page, and the
  position within the editor that the click occurred.
* 's2e:mousedown'
  This is called when the editor's display is clicked on. It provides
  attributes for both the x,y coordinates on the page, and the
  position within the editor that the click occurred.
* 's2e:mouseup'
  This is called when the mousebutton is released on the editor's
  display. It provides attributes for both the x,y coordinates on the
  page, and the position within the editor that the click occurred.
* 's2e:repaint'
  This is called when the editor's display is repainted

For a more thorough listing see the documentation (TODO)

## Design

S2E is broken into 3 main parts:

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

To add additional functionality to S2E beyond what is exposed through
the custom events you manipulate the Editor, Display, and InputManager
classes. These are exposed through the following points

* `jQuery.fn.s2e.config.Editor`
* `jQuery.fn.s2e.config.Display`
* `jQuery.fn.s2e.config.InputManager`

Adding fuctions to the prototype of any of these will make those
functions available later. Also, you could replace the full
implementation of any one (or all) of these to make S2E work in
complete other ways. Be careful when editing/replacing these classes
as there is a certain interface each object is expected to implement
and violating that contract could result in unexpected
behavior. Please see the documentation for a more complete description
of these interfaces. (TODO documentation)

## Contributing

TODO
