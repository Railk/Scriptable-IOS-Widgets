# Scriptable-IOS-Widgets
IOS Widget made with scriptable https://scriptable.app/ provided as is. 


## GARMIN HEALTH Widget

### A widget to show the health and steps data from your garmin connect.

#### heres a view of the three sizes in the blueorange theme :
![Image of the garmin widget big and medium size](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3766.png)
![Image of the garmin widget small size](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3767.png?raw=true)

#### To use this widget you need to 

1. Create a file named : **garmin.conf.json** in your scriptable folder with your login and password :

```json
{
    "login":"YOUR LOGIN HERE",
    "pass":"YOUR PASSWORD HERE"
}
```

2. Create a new script in Scriptable app and copy the .js code in it

3. There are 6 themes available, the default one is **blue orange**. You can override it with one of the others by :
  * Modifying the widget
  * Putting the name of the theme you want in the parameter field
  ![Image of the garmin widget small size](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3776.png)
  
4. List of the themes :
  * bluenight
  * blueorange
  * orangered
  * black
  * evashogoki
  * peach
  
5. you can make your own theme by :
  - Adding an object :
  ```javascript
  let theme_name = {
    'bgGradient': getGradient("hex color","hex color"),
    'chartGradient':getGradient("hex color","hex color"),
    'chartMask': new Color("hex color"),
    'chartMaskLarge': new Color("hex color"),
    'circleChartBase': new Color("hex color"),
    'circleChartPercent': new Color("hex color"),
    'infosColor': Color.white(),
    'subtitleColor': Color.white(),
    'iconColor': new Color("hex color"),
    'separator': new Color('hex color')
  };
  ```
  - And referencing it in the themes object :
  ```javascript
  let themes = {
    'bluenight':blue_night,
    'blueorange':blue_orange,
    'orangered':orange_red,
    'black':black,
    'evashogoki': eva_shogoki,
    'peach':peach,
    'themename':theme_name
  };
  ```
  
  #### Heres a preview of all the themes
  ![Image of the garmin widget small size](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3777.png)
  
  #### Bonus
  1. the curve represent your last hours steps not the full day (ie. are you active)

  2. If you do not walk for a long time the widget is angry (show teeth ;p) :
  
  ![Image of the garmin widget small size angry](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3698.png)
  
  3. If you didn't do steps the widget is circonspect:
  
  ![Image of the garmin widget small size circonspect](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3699.png)
  
  4. if you meet your goal you have a green check :
  
  ![Image of the garmin widget small win](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3767_b.png)
  



## TWITTER ART Widget (you need a free twitter dev account)

### A widget to show one of the last 10 drawing/paining/photo i.e image of your favorite users on twitter

#### heres a view of the large size (smaller sizes are the same)
![Image of the twitter widget big size](https://github.com/Railk/Scriptable-IOS-Widgets/blob/main/screenshots/IMG_3778.png?raw=true)

#### Usage
1. By tapping on the picture you can save it in your photos album
2. By tapping the username you can go directly to the tweet on twitter.

#### Configuration
1. Create a new script in Scriptable app and copy the .js code in it
2. **For this widget to work you need to have a twitter developper account (free) and get your BEARER TOKEN**
3. Put your bearer token here in the .js file :

```javascript
const BEARER_TOKEN = "YOUR BEARER TOKEN HERE";
```
4. Edit your list of favorite users here (remove the exemples but they are great artist though ;p)
```javascript
const USERS = [
  '666pigeon',
  'inukainuzoku',
  'daisukerichard',
  'Criisalys',
  'pacota22ma'
];
```
 5. Choose **run script** in interactions when modifying widget to enable saving on tap
