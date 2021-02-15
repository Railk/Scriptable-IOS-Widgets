// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: heartbeat;

/*-----------------------------------------------
Thx to these two project for the garmin connexion
and the data retrieving process.

https://github.com/Pythe1337N/garmin-connect
https://github.com/cyberjunky/python-garminconnect
-----------------------------------------------*/

/*-------------
    CONST
-------------*/
const OPTIONS = ['Small', 'Medium', 'Large', 'Cancel'];
const REFRESH_INTERVAL = 2;
const SIZES = {
  'small': {'width':156,'height':156},
  'medium': {'width':330,'height':156},
  'large': {'width':330,'height':345},
}

/*-------------
      URLS
-------------*/
const GC_MODERN = 'https://connect.garmin.com/modern';
const GARMIN_SSO = 'https://sso.garmin.com/sso';
const BASE_URL = GC_MODERN+'/proxy';
const SIGNIN_URL = GARMIN_SSO+'/signin';
const LOGIN_URL = GARMIN_SSO+'/login';

const ACTIVITY_SERVICE = BASE_URL+'/activity-service';
const ACTIVITYLIST_SERVICE = BASE_URL+'/activitylist-service';
const CURRENT_USER_SERVICE = GC_MODERN+'/currentuser-service/user/info';
const USERPROFILE_SERVICE = BASE_URL+'/userprofile-service';
const USERSUMMARY_SERVICE = BASE_URL+'/usersummary-service';
const WELLNESS_SERVICE = BASE_URL+'/wellness-service';
const WEIGHT_SERVICE = BASE_URL+'/weight-service';
const WORKOUT_SERVICE = BASE_URL+'/workout-service';

function activity(id) {
  return ACTIVITY_SERVICE+'/activity/'+id+'/details';
}

function activities() {
  return ACTIVITYLIST_SERVICE+'/activities/search/activities';
}

function dailyHeartRate(userHash) {
  return WELLNESS_SERVICE+'/wellness/dailyHeartRate/'+userHash;
}

function dailySleep() {
  return WELLNESS_SERVICE+'/wellness/dailySleep';
}

function dailySleepData(userHash) {
  return WELLNESS_SERVICE+'/weight/daterangesnapshot'+userHash;
}

function weight() {
  return WEIGHT_SERVICE+'/weight/daterangesnapshot';
}

function dailySummary(userHash) {
  return USERSUMMARY_SERVICE+'/usersummary/daily/'+userHash;
}

function dailySummaryChart(userHash) {
  return WELLNESS_SERVICE+'/wellness/dailySummaryChart/'+userHash;
}

/*-------------
     CONF
-------------*/
let fm = FileManager.iCloud();
let conf = await fm.readString(fm.documentsDirectory()+'/garmin.conf.json');
conf = JSON.parse(conf);

const CREDENTIALS = {
    username: conf.login,
    password: conf.pass,
    embed: true,
    _eventId: 'submit',
};
const PARAMS = {
    service: GC_MODERN,
    clientId: 'GarminConnect',
    gauthHost: GARMIN_SSO,
    consumeServiceTicket: false,
};
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    Referer: 'https://connect.garmin.com/modern/dashboard/',
    origin: 'https://sso.garmin.com',
    nk: 'NT'
};
const COOKIES = {};

const IMAGES = {
  'walk':'iVBORw0KGgoAAAANSUhEUgAAACIAAAA0CAYAAADvyOpEAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIqADAAQAAAABAAAANAAAAADt2sN2AAAENUlEQVRYCdWZW4hNURjH5wxjxi25jiSJksktmafJLR5opqEpg6HxJKW8eFIS4kGJB3lQigdJHhAlSQxPyIMwGIyaMxqXDDMTcplp5vh9Z/bW2t+sffbac86Z8tX/rLW+y//79t5rr732PomCQUoqlVpF6FqwErSC2+BKIpFopx0aoYi9wCZvUU4fkipItNNWgaFrpj8u78WQpNFIGtatjVtIYZwAspbiP98hZrWDT8AlViFESiEuMtXFyfSJW0gjwZ9NgpC+3EGxJFYh3Jop2K9FZOjGfiPCJ3sz82QkuBMyS/+gr84+iyMDyUaBE0DWDZGf4CZY40iRezeSzwDFuWf+Hxg58kogl+A9aANnQS1IDEn9JCoG50GY7M97IWSeAu6HVeDp+2ir8lYM5GUg6SWLai7npRCyzgOforIbdll1cyuQLwCfjSQu3V9SBY5yFpdlXREki0A7iCs/vEJWEdgFFsUpJvCsIXgCwdfBpDgknm+n1wqHbIzkNp/t6SKbQCF4nwJ6q5dEdxBESYfnMN5rZStwi2LibQkIGAF+AVMeM5gKppnKkP49KQDbHmX/xvijgiyGF8ASiREZ3t+kfxfyW2KM++iv4NH/nYAFhj6s658R/dwZS4BASx2KOaBcDOalmSYKQzqkCG8s1z1K/DlyDMeGKGfPPouDLJK+WchkFWy+n0xUNtsw7U/xPzFWgzM2J0MnG6ij+PeIzrw0+k4xC3E5Iy1+Eq+Y7RztAXRy54z2bV7bS/sIvy5fn6kQc28qW8Qo+VeI70ii9/QFkeJ6aV5FMhUUuPiE0piFtCmvJ8a4yejbus0c/TubIbaO61kOZGkW+QIC15Wxvz8Vu5aTsRNmCoB9HFgDRmk/dOtAmFRp/7yOqeJqSCW785pYk1OELPWyXGv5jcJl9dWU8cYkmQtkSZZnyVLQDbQ8Q6GX93iJorxJsA3IS9Rir5hd9G1yPIorKzsZT3pZW2nTjwLac57ObGQTvTyrZJmCIX9oZLtLfziQd2DZJmh5jsJcnzJRu9sgLQIyGU05LAwoZoKvpsHr17tn6Pd0qXw9rnoSpjfKrKZJbLv6qQK/+yjIhTsQFDqAbCGQjZGWMj8IQwLYvqtt8X2yaiEvBTI5tQz4UIPDRu3E+CXI7qxAUALMCcowLS386n2LzJVC8AJo2TToswGTnOqLmpGxbIJDvyhi22yJkTtocF8KCDxkIexFV5np6LDLWWmyxG7IFGe1QbLVQiQqp4daSPxT9O5nBecKoNcLVKnT1qotSnyHgdcSpKTG4j5QRdBEIF+BtDSgSG/3B0bZNfjXaxLGD+zeSovjDkvwG3Quu/cAGzFyVuSPAS2BHV8gyB8QUaOiOhnLW9ighNg6xdfoRESQPMQugR7wAVQ4BWZwguMIkDmXBPKYcBcCxgD3GR5BDZc8obNbXSNy5Nz8FxRbT/qtrcVFAAAAAElFTkSuQmCC',
  'calorie':'iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAKAAAAACc9ikyAAAEb0lEQVRYCc2YW4hWVRTH/bxrJXk3UmxsCLw8KL54TYSoECkoQRAMn4wgS7IQS1AQb4ighA9pLwkVEYYIkTZElwe1vKRCReVlHMeJTEWlxPvX739mr5l1znfO2TOi4IL/rNt/rW9/++yz9/6m0qVAqtVqX1LjwU1wBvxdqVSq6PsvfPgicBN4uY5zEnwD3gIj7ttIaN4EYnIHwl6wGDx+TwdDw43A5G2MGWAu2AD0oZoNL7dwVPPwPRkIjXqBg0ByGYz2jfF7g/ngV+DlDM5LnnvXNo1GgUuh++/o7tlmxLqCl8Fh4OVLnLosv9M+TfQtTeaWNYA0C+wzMvo8GFtWE83RoAJ+BpL9sQI4mpGtIgdpQT8ZqyvN0+B564aeXEomCUeDft/VNGIPj9WV5mlwLDRcXUp0Sfh6Y0y0hoa4dLEJsQ7M8wXY24Dks+LK2gz8VUlV659vaxk5EbhHQ5E2mk1AU/paiB3KKSkNUbc91ErNLCUrCemcK5D5CZgWYpejDTIE6gaDC6E+PgsQjweyV5uD82+mf4dcal91zaaXFkHUqpXsATsSq/3PH6XFBUnKewKb2YYCWjL9PSBqX5do4Q0BF+UE2V5YHElQv86aoNte566ZujH43ULsNOf/OeytjrPb2Z01P3QFc5zdbmZGOVUZYhPDyE+ge7SzO29R3xR67aupJqFtVKeZRBePipGwtQjHmW+a2ELwnPkxDVdvlETHee8Un8BsZYIsTyULHLhrgfYLPd+a0zJbBucNYKLrXhe/BhaGguvoD4IdU3okmqml4Ac6xy4kZ13DgbKTAVCoC+izIfkFi++fYMeU/9Za2SsjBRddvr9smwFtkb1CckfQuYrBTnKJR50t803yNWvFcS44OzWAGSFxA/2VI6VMmusV3YleHBLJm+JImpEtzs+afVzgjmybQrvVNjH9Vx0pa2qdDAVrGEQLuj5LwH+a3AD6+Ok2mn2O/PP6Y49gmBxETXOFpjrP14ekvsnHucTWYLLCc/J+AMk6swEMDuS/coos9C7GI+agbfZcqM2c0GaljZHObZJtA7gUEsnCcCRvvuCdiD2gIP9iiP/JI2qWbQM4FRK5F0imX6/pE4HTEVVzcaHHFAptzTRYExtAYwiMhJg3C9qcrllRB/SPOZxXXGyXs5MDZyYfbJK7DZPcb4SIPpxqjgN/AtD+LzmYzSc+iSNJuvXi4Beb5Z8hr32/TFpIpn414/cFv7mi/LUEYYEjNWD3zI6U2OvgP8fz5hWcib4Gvxv4yJF2+nzKhtQd6Bpm8jnGQykSDrHhYAX4FHwf9BJ0au3gDwL6X4KJZqFftl/KFwHYjxAVNoLZKVLEga97hY7208BEfZ6KlLamIY4AB6wy6EPo98DovCbEdZesB8vAKeDlO5xBeXWFMQr07N4BV0FWtJp1tfoJ6NdwM7gNsqJfx+px99c4iuvASvAL6KjoEWq2at6kvG/cdu/LS/oYDXVjngoeAzq8pKtAh4puzyfB12yx/tZD6AGX/wEbCnQzQ9Z4twAAAABJRU5ErkJggg==',
  'ecg':'iVBORw0KGgoAAAANSUhEUgAAACYAAAAoCAYAAACSN4jeAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJqADAAQAAAABAAAAKAAAAAA7wp46AAADGElEQVRYCe2XOWsVURTHZxI31FgYo0JcI1pEEMUtCmplo4XpbPwewcLawsLGDxD9AhpSaqUgJjEKgguIhYoILuCSoKLw/J155zzum8xyZ959MYUXTs69557lP2eZN4mi/2sRMtBoNAahKejiIoTzDwGgS5Csb/5W1TR7qqm3tI/qrg9w21rSgJtOgQmU4YB4Wq4qAyNDu7De0PKwVIAByMpo2JZGxkAzYoiUdwVYKkb5kVLKa8JdX8qtuqwBmpXQL0U17qAbLAqN3nloDIqL9Grf4XgEsnWWzXc9nM5zyv0W6I/qjebppeVVp9Jt/Ac4e6YOi/rsBDq9qndSeSmrCswa/2Ucx5/x7gPsmIPiuLMv3FYFZhmbUq9PlRdlzAV2gJKuKkSkl97AcLgRm51qJ2WUVZgxbFajsz/RbP5ZATvonHO33sDwYNkSZwbMMrYeEJszohxCtkzlH5V7lbMOsJ8EeKJB3sDndJ9VTivjPDo3VM9kesxmdYDN0vi/xR28AXuurouAzaIzrXrhMkaZ5AGOqGNrfD1GVs4iYGIj4GRtwt9Qc5v/N6k/in2oXIX25KjuRb5O76y/TNUGQHRaC5/yFSIDI2ua7L5C1jxFkezv2cHhUvLL6N5NZCidg3yWvMHbfn44n1HDD06ACNkFlQvbKnfwSUeWt70lujYxd9hfg3aLMGOtQSY/1jd5mnepe8vYAJEGuLfpsyZ/j+yt2ozBv0LbIclOeskgXUkLa50BE0Nz+vinzAnnRypLMmByX15lKjN9ko0FkwmgtSjvUwObxkz7PGHHwNSxTaYNwGHk9sOdnuI8LG3y0MDslWH9JdmcaYvoeQgFzAYgDewFpe7a/56lz0hP7dBGF9YPfdLzeKlxjkKojL3Gv43/KPt+jVerv3Kw1hOToRnN0n3lwrw+cepF9LQCxHUHkGx/QMs9zReohSqlOLZXhgV5TOMnXyEmqMJDArPJtPgd9VdIYOmM1Xrj21MF4/RTDzQP2RoK5rxTRyB6qKjsC6O2y5ClFBC3FclEbUTdMCRbvdAwZN953Qjzb33+BY3k31evmX/HAAAAAElFTkSuQmCC',
  'stress':'iVBORw0KGgoAAAANSUhEUgAAACQAAAAiCAYAAAA3WXuFAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJKADAAQAAAABAAAAIgAAAAClThZcAAAEGklEQVRYCc2XSawNWxSGHf3TNy8mV3MTfQTBROIxEE0YiCt5ZmYiIdEPCANNngExMNC8hIkgESTahLgjie4FQdxEE+11o0kQD9Fzff+5tVh1atc5dc6dWMl39tpr/WvXrqpTu3a1aPGbWS7LfBobG/uhq4Yn8DiXy32kLWnU9UTUF/6AG9S9LVkUEjBQJ1gHtfASvH2mcwgmptR2JLcE6sDbdzq3YT/MCtUGY4jHwT3IYiv8IBT0hP+yFKLZC119fcJHsB6+gZnOSgfYBzvhMnwCb5vp5KAP3PQJ/BdwErbDMWgAb/V0xiYmogCJGq/EPwyDC8XE2sE8eAdmB3EeW4f2OowK1LYiPguegdlDnA4xLYHO4Ac8Tr91TFTQIT8IbkGh7SLQrkAe65IfCa9d4aZCwRaXPIPfPiZI6aDTpPzAui0tU+SxMLq/4D3IvsDwvACnNXwEmW5Dt1hliQ76afAVrkLnEvJYGv1CMNuWT9IbahHaPbGKjB3qBkAnyWmL3mo/JNoeYA/JGeV0eZsuVZOytqkp75cF7y4VuvyHaTdmrabuFdorkT4/j8IJNWQdLKBbR2wmXArkioXsmN05oSpNqMqp3zg/s8tANYhXg+qPZi5sEvpj5idU7wbwk3PhdJfJDCW7G3JwgNvwIV0dzPhj1usK3XeyaueXdJmMlv4jYE+XJlauVUcF7zmZZ3oqxoPZyayjUaDXhdYds3tZa01HYTXo9SSry8dx9Hb+XxFM60kvKyjWolurAmdriulDOWpXufqtPzUEt7nEqp+JFAftDLAzs1Itqlq1jef4vVOG0J1pA35X8Wv5ITECzHS1Uq8SucFgV9RqQq3eh/qjB43cYld0PiEiec4J/k0IogAabUVK2R0EqXsdclqh/cZvTuJ4CEaDXnIy3Y7pCREB4h2gn0OvjTdgpls3LFRrMfLa2pidxdHTnjQS/5iKVpsrv0YkC4igqXE1cv8OCqMg+UVOr9fNoFQ9ybZQ5wou4adeeg1E/qjTF32PoZsK9jJV2fLUyVgC0Sh4K3Vk2sIGJ0W8F9htrsVvZeMUtuSmwAcwO40TvlWB4kmI/ZkEJ4VmaTT6A1p98gSN3GTwk9GVz29XggWhIAWzwW/4L9Lv4rX0r4H+B4n9s+nI6eSkMdO290/Ll9VSON9GidoLtPkdJW1VFEs+stFRyOvK+Mk00NdHZ+XGAHPA3z6trmOgJehNnzDies+tAPt/4TbeAH3FNt8YaAL4hUx78AWhkYlr0TsB3k7Rid3uUG1ZMQYcCFqBvemz2LYeWgLGwiMvwN8BmffZ5U5KZ3+k4ICapFb5ZfDZ5fTfmV/WASoVc6C54NcqN4+8q0/uIZWOX1EdB+wPeuq8aZnYAG0qGrS5RRxY3+or4SlonRrX3DF/AJG4fhFwAOC3AAAAAElFTkSuQmCC',
  'sleep':'iVBORw0KGgoAAAANSUhEUgAAACIAAAAkCAYAAADsHujfAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIqADAAQAAAABAAAAJAAAAACNOlT0AAACM0lEQVRYCdWYPUwUQRiGb0UE/4CgMf6Ea0iUBmNBRwHXQiIeBivNNXRUhoaEhthYWBgSagoTrKDRjoaKhhBLAqeViRpyMWJy8YiJns9HGLKZvdv9Zm93L37Jk52deef9Xubu9i7kcv9b1ev1x/Cqbblpnof3ILXWliA0LsBPSXBaY5kHofE0HJsEXPfbEWKKxn98IWQ4n2kQGg7CkXS26m5mQWjcBR+sAHL7F7qyDPK8QQiZ+pJliMs0PGwSZDvtIOd8DeYY3/Dd+4epn4g/yFN/Z2vcZ90nfnsShJcjj/NwiPutkLVElsyJTEa4ZRbkfkSQa5zanQhNS8vmRG4qXKYUmtgSlyCPYndRbDRBrii047w8mpNTWAUlJshhcCkw08nMUmA2oQkT5JvSb5ZTGVJqnWQmyFflrg50rwnjKfVuMowfgku9cOugVJOgG6ouSdA+Udq7yTDecAzyC33RrYtCjemEYxCRyw+mRYW9mwTTLYhT62wacOsWosZsBOSvjFM1Nr2E3pAW+iWMVuKk8O35wfgNFOFSWGfWe2BUNIHnAQvnmd+EggharBr790CeU/LQrMBVuA734AGUT69crCJMP3yCtGuXBhKqeSG4DTspJtnCW04nuhBehLeQdL3DsDs6gaVgUwk+Q6tVxqAE8p0Vr9gsp7MAFXCtAzY8g/gB7NhiBvLvimX4CL+hUcmbfRVmwHzL23Zn94GP79mKckAT8ZB3vvzSvwDfoeJ5XpWruv4BS+6UuQkTYsQAAAAASUVORK5CYII=',
  'heart':'iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAJqADAAQAAAABAAAAJgAAAACE8iBbAAADOElEQVRYCc2YT4hNURzH55mRmVAaSqZolIbxZ8Eo2cifbMhQilgQYjE1pJCk2UpYkKVZkR07CwsU3ixGiWZDM5kYERokTE3G8/nd9857975zzzn3z7svv/q+c+7vz/d873nn3nvubWj4Ty2XVFehUJhO7XrQDhaU0Ej7sYQx2nwul5ugzdYQ0wR2g1vgG3DZLxLuggOgJRN1EO8Cr0BSe0/hYTCtJgIhWgyegFrZEERdqcRBsAF8qZUiH89v+nsSiaNQ1sWkjyyLbl8scSjYCv5koSSE81gkcRR2gChXXMgYiVzyr2ysFhe4j5HQRMILsKI6MePjcfiXcs+T1rPqS/co3nqLEiFzwXnpKCvPGLM1C+cImK+ChvYN/gfgKegE28Eq4LdhDu6B52Ad2Awk12aTBDuZNeGvGMLOAJcFzkpVU7QX/C0Vn1R+f0vsiC+nlKo1/f4ar0/KMy0t6LigFfkcpJ4Al30urUv8eJBSO/qKR9Z50ThYqKUEHT84lAd0aoNnOEitHW2RQdTi73aMOMB/P+XIiRqWtWmznRJUwpbZMokNOOJxwnlHsqdFCZP9lM1m2oIxY3L128zTooS12TKJrXbE44TXOJI9LUrYbEdyF0tUdqypDA65b8qu12aeFiXsky2TWCvoceRECe8jaYkjsaKFM7mpXbS6YxzXHAepMUxtM3ir02qeQSFRM/bByFgJyKxdqxzG7l2kYlGEqooWNHdrus2OeJs7lEDVa6bTIqfL4gnJNP/UUsyOQ+ViRwcKeauaMlNpkeAaJHxHSzE75IF9zqFJZqoHxNkJD2mcEGwDce0GBTOqyfA1gktxycgP3ZnIGT5KQPaSmuVKHP12kE/AM0qNdpIeL4G1QO2r6Ea2CTL7gCzy75Grgon71cmFtuReD+bX5eg+o5R30yZh8n3iYV3kFAd5TRPtxk1iKxgp1mX6K6+JHaEzZHJS0AYGM5Q1CvdK0/hWP4Ut4DaotT2GcJ518ChBSA6CdyCtyV93CqTeQpV1QyazdxYk+fojj7srQDYC2RjkclffBK4CeeMJ+yIkj6Ex0A92gOa4auz3jghsDCocsl5kry7vhPIN9nPat6p/QPV6roMc8t4AAAAASUVORK5CYII=',
  'win':'iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKqADAAQAAAABAAAAKgAAAADUGqULAAADdElEQVRYCdWY24tNURzH50yMkTJmHlwyQ0gmUiglQ5JLlBe8UDwpcnnxIiS8kDz4ByiXGU9epqhBJrmUW8qDBg3KA1PCRLkOc3x+e2Yd6+y91jpr77PPPvnVt/Vbv8v399vr7LX32qem5j+RXJp95vP5efCtBw3gWi6X60qTv2wuGsyBA+A30OUikzFlF0iDgEZqwVlgk/s4ZIWrJzQgTZ6zdajZH6BXp1kKN4F2rZlS6kMCpiddVudmgrgV4kNgLpgCRgAl9Sj6XNldYx7nVy1gEL0P9IJTbL6bms9PpclF4BfIUnbYurOuKN3dJanNllghez+8LaysvupBqVpTQZoU+0KTr8K2RvhnmWoYGyVwMqgzJWRgm2aqYWt0lCk4I5ts0ojYGo0EVtuQZaPyaOoAd5JctK3RsUnISuQcZTdvJWYZeOGI9XuDyY4Hl0Ca8hSykdIco/C/dJA/wye73y7DJD7vbkediGsQyxJVFX13JCJqeIzJ3CyOUqegKJ2f5bTWZDMpX/zS8o+IG6dyCyPGY54EccLeE9ykiqB3xkkm9gb4t4+YrATyE6UtsnkCgXhjQvKDikNu8I6EJK60blWAoAbwzhXs8L0SHrWsMxSp57iZuKngliX+J/admu8E+iRtHkdt4SKCJ4as6EnHFYVdPaoKjkbwOhzA/IgW08a8nNtKTnFDAtF48Bb4iJxR5UAdCPoC8F1LfI4enBUY60CP5ourDpBQfNTEsBh882SSh3Lh7YW+Tctbrl3EYc2eRN2juIpGmGT366vjIr+CU93jcvucAecVIXor+AGSyj7FZRxhXQV8mz2uSMipB8Ezk1G+82+DpLJf8TpH2HfFqLApTEbu9hj54dD2MJ91TubMcLZjLvf1fEWGPhH0O+JLubYoLn0s3GO6EV3Ojr4ymsAuqq8D8p3VCaLvaF82S+243+W2chNwXLY507DbVjQN7lQ5bI1+TLVKPLIPpnBjo3wyyB8Bn0wJGdiCQ0i4jrHR4aAL4eAM5veoYWzUWpsdLEez6yArkdfyHFtDOZtD2Uleim76N68Z+wYwdARTCe6xG/cTLUQeg32gF1zllhvQfOmpXMRa4Ps+93stptdeMRONrgGlzgbuA0YxZeVmNLoafAZh+YNhb+UqJ2CmITkfyN/fSt6grEhAlU0Kzcm3++y0q/0FlloaAYhWmV4AAAAASUVORK5CYII=',
}


/*-------------
     UTILS
-------------*/
function toDateString(date) {
  const offset = date.getTimezoneOffset();
  const offsetDate = new Date(date.getTime() - (offset * 60 * 1000));
  const [dateString] = offsetDate.toISOString().split('T');
  return dateString;
}

function getCookieString(){
  let result ='';
  for (const name in COOKIES) result+= name+'='+COOKIES[name]+';'
  return result;
}

function parseCookie(cookies){
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    COOKIES[cookie.name] = cookie.value;
  }
  HEADERS.Cookie = getCookieString();
}

function getQuery(data){
  let result = [];
  for (var name in data) {
    result.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
  }
  return result.join("&");
}

function getRequest(url,params){
  url = params!=undefined ? url+'?'+params : url;
  let req = new Request(url);
  req.headers = HEADERS;
  req.method = 'GET'; 
  req.onRedirect = function(){return null;};

  return req;
}

function postRequest(url,data,params){
  url = params!=undefined ? url+'?'+params : url;
  let req = new Request(url);
    req.headers = {
      ...HEADERS,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    req.method = 'POST'; 
    req.onRedirect = function(){return null;};
    req.body = getQuery(data);
    
    return req;
}


/*-------------
  API CALLS
-------------*/
async function checkRedirect(res){
  if(res.statusCode === 302 || res.statusCode === 301){
    let location = res.headers.Location;
    let req = getRequest(location);
    await req.load();
    parseCookie(req.response.cookies);
    await checkRedirect(req.response);
  }
}

async function signin(){
  let req = getRequest(SIGNIN_URL,getQuery(PARAMS));
  await req.load();
  parseCookie(req.response.cookies);
}

async function login(){
  let req = postRequest(LOGIN_URL,CREDENTIALS,getQuery(PARAMS));
  await req.load();
  let res = req.response;
  parseCookie(res.cookies);
}

async function dashboard(){
  let req = getRequest(GC_MODERN);
  await req.load();
  parseCookie(req.response.cookies);
  await checkRedirect(req.response);
}

async function getUserInfo() {
  let req = getRequest(CURRENT_USER_SERVICE); 
  let json = await req.loadJSON();
  let res = req.response;
  parseCookie(res.cookies);
  USERHASH = json.displayName;
}

async function getSteps(date = new Date()) {
  const dateString = toDateString(date);
  let data = await getRequest(dailySummaryChart(USERHASH),'date='+dateString).loadJSON();

  return data;
}

async function getHeartRate(date = new Date()) {
  const dateString = toDateString(date);
  let data = await getRequest(dailyHeartRate(USERHASH),'date='+dateString).loadJSON();

  return data;
}

async function getSleep(date = new Date()) {
  const dateString = toDateString(date);
  let data = await getRequest(dailySleep(),'date='+dateString).loadJSON();

  return data;
}

async function getUserStats(date = new Date()) {
  const dateString = toDateString(date);
  let data = await getRequest(dailySummary(USERHASH),'calendarDate='+dateString).loadJSON();

  return data;
}

/*
async function getSleepData(date = new Date()) {
   const dateString = toDateString(date);
  return this.get(urls.dailySleepData(this.userHash),'date='+dateString);
}

async function getActivities(start, limit) {
  return this.get(urls.activities(), { start, limit });
}

async function getActivity(activity, maxChartSize, maxPolylineSize) {
  const { activityId } = activity || {};
  if (activityId) {
    return this.get(urls.activity(activityId), { maxChartSize, maxPolylineSize });
  }
  return Promise.reject();
}
*/


/*-------------
    CHARTS
-------------*/

//HELPERS
function sinDeg(deg) {
  return Math.sin((deg * Math.PI) / 180)
}
  
function cosDeg(deg) {
  return Math.cos((deg * Math.PI) / 180)
}

//LINE
let Linechart = function(data,width,height,color){
  this.ctx = new DrawContext();
  this.ctx.size = new Size(width,height);
  this.ctx.opaque = false;
  this.ctx.setFillColor(color);

  this.getPath = function(points){
    let path = new Path();
    path.move(new Point(0, 0));
    path.addLine(points[0]);
    
    for(let i = 0; i < points.length-1; i++) {
      let xAvg = (points[i].x + points[i+1].x) / 2;
      let yAvg = (points[i].y + points[i+1].y) / 2;
      let avg = new Point(xAvg, yAvg);
      let cp1 = new Point((xAvg + points[i].x) / 2, points[i].y);
      let next = new Point(points[i+1].x, points[i+1].y);
      let cp2 = new Point((xAvg + points[i+1].x) / 2, points[i+1].y);
      path.addQuadCurve(avg, cp1);
      path.addQuadCurve(next, cp2);
    }

    path.addLine(new Point(width,0));
    path.closeSubpath();
    return path;
  };

  this.calcPath = function(){
    let maxValue = Math.max(...data);
    let minValue = Math.min(...data);
    let difference = maxValue - minValue;
    let count = data.length;
    let step = width / (count - 1);
    let points = data.map((current, index, all) => {
        let x = step*index;
        let y = (height/2) - (current - minValue) / difference * (height/2);
        return new Point(x, y);
    });

    return this.getPath(points);
  };
}

Linechart.prototype.getImage = function(){
  let path = this.calcPath();
  this.ctx.addPath(path);
  this.ctx.fillPath(path);
  return this.ctx.getImage();
}

//CIRCLE
let CircleChart = function(baseColor,percentColor){
  this.ctx = new DrawContext();
  this.ctx.opaque = false;

  this.drawArc = function(pt, radius, lineWidth, deg) {
    this.ctx.setFillColor(percentColor);
    this.ctx.setStrokeColor(baseColor);
    this.ctx.setLineWidth(lineWidth);

    let rect = new Rect(pt.x-radius,pt.y-radius,radius*2,radius*2);
    this.ctx.strokeEllipse(rect);
  
    for (t = 0; t < deg; t++) {
      let rx = pt.x + radius * sinDeg(t) - lineWidth/2;
      let ry = pt.y - radius * cosDeg(t) - lineWidth/2;
      let r = new Rect(rx, ry, lineWidth, lineWidth)
      this.ctx.fillEllipse(r);
    }
  }
}

CircleChart.prototype.draw = function(percent,radius,lineWidth,icon){
  let r = radius-lineWidth/2;
  let pt = new Point(r+lineWidth/2,r+lineWidth/2);

  this.ctx.size = new Size(radius*2,radius*2);
  this.drawArc(pt,r,lineWidth,Math.floor(percent * 3.6));
  this.ctx.drawImageAtPoint(Image.fromData(Data.fromBase64String(IMAGES[icon])), new Point(radius-16,radius-24));
  return this.ctx;
}


/*-------------
    INIALIZE
-------------*/
let USERHASH = '';
await signin();
await login();
await dashboard();
await getUserInfo();

/*-------------
    GET DATA
-------------*/
//STEPS
let steps = 0;
let data = [];
let stepsData = await getSteps();
let wave = -0.3;
for (let i = 0; i < stepsData.length; i++) {
  let curSteps = stepsData[i].steps;
  steps += curSteps;
  if(i>stepsData.length-8) {
    curSteps = (curSteps === 0)?wave:curSteps;
    wave = (wave===-0.3)?0.3:-0.3;
    data.push(curSteps);
  }
}

// PAS DE PAS ?
data = data.length === 0 ? [-0.3,0.3] : data;
 
//HEART RATE
let heartData = await getHeartRate();
let heartmin = heartData.minHeartRate || "--";
let heartmax = heartData.maxHeartRate || "--";

//USER STATS
let userStats = await getUserStats();
let dailyStepGoal = userStats.dailyStepGoal || "--";
let calories = userStats.totalKilocalories || 0
let stressLevel = userStats.averageStressLevel || "--";

// SLEEPING
let minutes = userStats.sleepingSeconds/60;
let hours = Math.floor(minutes/60);
minutes = minutes - hours*60;

// DATAS
let datas = {
  'wave' : data,
  'steps' : steps.toString(),
  'heartmin' : heartmin.toString(),
  'heartmax' : heartmax.toString(),
  'stepGoal' : dailyStepGoal.toString(),
  'percent' : ((steps*100)/userStats.dailyStepGoal).toFixed(0),
  'calories' : calories.toString(),
  'activeMinutes' : (userStats.activeSeconds/60).toFixed(0).toString()+' min',
  'sleepingMinutes' : hours.toString()+'h'+minutes.toString(),
  'stressLevel' : stressLevel.toString(),
}

//DUMMY DATA
// let steps = 178;
// let data = [-0.3,0.3,-0.3,0.3,-0.3,0.3,-0.3];
// let heartmin = 34;
// let heartmax = 120;
// let datas = {
//   'wave' : data,
//   'steps' : steps.toString(),
//   'heartmin' : heartmin.toString(),
//   'heartmax' : heartmax.toString(),
//   'stepGoal' : '3000',
//   'percent' : '76',
//   'calories' : '1765',
//   'activeMinutes' : '20',
//   'sleepingMinutes' : '900',
//   'stressLevel' : '34',
// }


/*-------------
  WIDGET UTILS
-------------*/
async function presentAlert(prompt,items,asSheet) 
{
  let alert = new Alert();
  alert.message = prompt;
  
  for (const item of items) {
    alert.addAction(item);
  }
  
  let res = asSheet ? 
    await alert.presentSheet() : 
    await alert.presentAlert();
  return res;
}

async function getImg(url) {
  const req = new Request(url);
  return await req.loadImage();
}

function getGradient(color1,color2,begin=0,end=1){
  let gradient = new LinearGradient();
  gradient.locations = [begin, end];
  gradient.colors = [new Color(color1),new Color(color2)];

  return gradient;
}

function getTextIcon(container,iconName,textContent,color,fontSize,iconW,iconH,offset=0){
  let stack = container.addStack();
  stack.centerAlignContent();
  stack.size = new Size(0,iconH);

  stack.addSpacer(offset);
  let icon = stack.addImage(Image.fromData(Data.fromBase64String(IMAGES[iconName])));
  icon.size = new Size(iconW,iconH);
  icon.tintColor = color;

  let text = stack.addText('  '+textContent);
  text.font = Font.mediumRoundedSystemFont(fontSize);
  text.textColor = color;
}

function getSubtitle(container,theme,datas,large = false){
  if (large){
    let subtitleStack = container.addStack();
    subtitle = subtitleStack.addText('Objectif '+datas.stepGoal);
    subtitle.textColor = theme.subtitleColor;
    subtitle.font = Font.mediumRoundedSystemFont(16);
  } else {
    let HRStack = container.addStack();
    HRStack.centerAlignContent();
    getHeartRateUI(HRStack,theme,datas,large);
  }
}

function getHeartRateUI(container,theme,datas,large = false){
  let color = large ? theme.infosColor : theme.subtitleColor;
  getTextIcon(container,'ecg',(datas.heartmin || "--")+' / '+(datas.heartmax || "--"),color,16,16,16);
}

let getMoreInfos = function(container,theme,datas,large = false){
  //CONFIG
  let fontSize = large ? 16 : 14;
  let s = 
  large? {
    'calorie':{'w':13,'h':16},
    'stress':{'w':16,'h':15},
    'walk':{'w':15,'h':18},
    'sleep':{'w':15,'h':15},
  } :
  {
    'calorie':{'w':12,'h':14},
    'stress':{'w':14,'h':13},
    'walk':{'w':14,'h':16},
    'sleep':{'w':13,'h':13},
  };

  let separator = container.addText(large?'_':'|');
  separator.font = Font.mediumRoundedSystemFont(large?16:12);
  separator.textColor = theme.separator;
  container.addSpacer(large?16:24);

  //CREATE
  let more = container.addStack();

  // COL 1
  let moreC1 = more.addStack();
  moreC1.layoutVertically();
  if(!large) moreC1.addSpacer(16);

    //CALORIES
    getTextIcon(moreC1,'calorie',datas.calories,theme.infosColor,fontSize,s.calorie.w,s.calorie.h,1);
    moreC1.addSpacer(8);

    //STRESS LEVEL
    getTextIcon(moreC1,'stress',datas.stressLevel,theme.infosColor,fontSize,s.stress.w,s.stress.h);


  // COL 2
  more.addSpacer();
  let moreC2 = more.addStack();
  moreC2.layoutVertically();
  if(!large) moreC2.addSpacer(16);

    //ACTIVE MINUTES
    getTextIcon(moreC2,'walk',datas.activeMinutes,theme.infosColor,fontSize,s.walk.w,s.walk.h,1);
    moreC2.addSpacer(8);

    //SLEEP TIME
    getTextIcon(moreC2,'sleep',datas.sleepingMinutes,theme.infosColor,fontSize,s.sleep.w,s.sleep.h);


  // COL 3
  if(large){
    more.addSpacer();
    let moreC3 = more.addStack();
    moreC3.layoutVertically();

      //ACTIVE MINUTES
      getHeartRateUI(moreC3,theme,datas,large);
    }
};


let getRightIcon = function(container,percent,theme){
  let iconStack = container.addStack();
  iconStack.addSpacer();
  percent = isNaN(percent)?0:percent;

  let icon;
  if(percent>=100){
    iconStack.size = new Size(0,14);
    icon = iconStack.addImage(Image.fromData(Data.fromBase64String(IMAGES['win'])));
    icon.tintColor = new Color("2CFFA9");
  } else {
    iconStack.size = new Size(0,13);
    icon = iconStack.addImage(Image.fromData(Data.fromBase64String(IMAGES['heart'])));
    icon.tintColor = theme.iconColor;
  }

  return iconStack;
};


/*-------------
  CREATE WIDGET
-------------*/
async function createWidget(datas,theme,size) {
  let refreshDate = Date.now() + 1000*60*REFRESH_INTERVAL;
  size = config.widgetFamily || size;
  let small = size === 'small';
  let large = size === 'large';
  let medium = size === 'medium';

  // DIMENSION
  let wWidth = SIZES[size].width;
  let wHeight = SIZES[size].height;

  // WIDGET
  let widget = new ListWidget();
  widget.setPadding(0,0,0,0);
  widget.refreshAfterDate = new Date(refreshDate);
  widget.backgroundGradient = theme.bgGradient;


  // CONTAINER
  let container = widget.addStack();
  container.setPadding(0,0,0,0);
  container.size = new Size(wWidth,wHeight);
  container.layoutVertically();
  container.topAlignContent();
  
  // INFO
  let pad = large ? 26 : 16;
  let infos = container.addStack();
  infos.setPadding(pad,pad,0,pad);
  infos.layoutVertically();

    // COLONNES
    let cols = infos.addStack();

      //LEFT
      let left = cols.addStack();
      left.layoutVertically();
      left.spacing = large?-7:-5;

        // TITRE PAS
        let titreStack = left.addStack();
        let titre = titreStack.addText('Pas');
        titre.textColor = theme.infosColor;
        titre.font = Font.mediumRoundedSystemFont(13);

        if(small) getRightIcon(titreStack,datas.percent,theme);

        // NB PAS
        let nbStack = left.addStack();
        nb = nbStack.addText(datas.steps || '0');
        nb.textColor = theme.textColor;
        nb.font = Font.mediumRoundedSystemFont(large?48:38);

        // SUBTITLE
        left.addSpacer(large?10:8);
        getSubtitle(left,theme,datas,large);

      // RIGHT
      let right = cols.addStack();

        let rows = right.addStack();
        rows.layoutVertically();
        rows.spacing = -10;

          //ICON
          if(large || medium) getRightIcon(rows,datas.percent,theme);
        
          // PROGRESS
          if(large){
            let progressStack= rows.addStack();
            progressStack.size = new Size(0,72);
            progressStack.addSpacer();

              let circleStack = progressStack.addStack();
              circleStack.setPadding(8,0,0,0);
              circleStack.size = new Size(120,72);
              let progress = new CircleChart(theme.circleChartBase,theme.circleChartPercent);
              circleStack.addImage(progress.draw(datas.percent,72,13,'walk').getImage());
          }
          
          // INFO MORE MEDIUM
          if(medium) {
            let moreStack = rows.addStack();
            moreStack.size = new Size(0,0);
            moreStack.addSpacer();

              let more = moreStack.addStack();
              more.setPadding(0,16,0,36);
              getMoreInfos(more,theme,datas,large);
          }

    // INFO MORE LARGE
    if(large) getMoreInfos(infos,theme,datas,large);
    else infos.addSpacer(8);
    
  container.addSpacer(large?22:6);

  // COURBE
  let waveHeight = large ? 142 : 62;
  let chartContainer = container.addStack();
  chartContainer.size = new Size(wWidth,waveHeight);
  chartContainer.backgroundGradient = theme.chartGradient;

    let chart = new Linechart(datas.wave,wWidth,waveHeight,(large?theme.chartMaskLarge:theme.chartMask));
    chartContainer.addImage(chart.getImage());


  return widget
}

/*-----------------
    COLOR THEMES
-----------------*/
let blue_night = {
  'bgGradient': getGradient("0D0D46","21236D"),
  'chartGradient':getGradient("382DC3","4D9EF0"),
  'chartMask': new Color("191B5F"),
  'chartMaskLarge': new Color("181959"),
  'circleChartBase': new Color("392DC3"),
  'circleChartPercent': new Color("4B91EB"),
  'infosColor': Color.white(),
  'subtitleColor': new Color('62638F'),
  'iconColor': new Color("46478C"),
  'separator': new Color('595A76')
};

let blue_orange = {
  'bgGradient': getGradient("1B1F5C","0A0D41"),
  'chartGradient':getGradient("8065FF","FF634A"),
  'chartMask': new Color("101549"),
  'chartMaskLarge': new Color("12134C"),
  'circleChartBase': new Color("C7659B"),
  'circleChartPercent': new Color("8665F5"),
  'infosColor': Color.white(),
  'subtitleColor': new Color('737597'),
  'iconColor': new Color("8B88F5"),
  'separator': new Color('444593')
};

let orange_red = {
  'bgGradient': getGradient("FF4E0A","EC5D0E"),
  'chartGradient':getGradient("901E02","BB3013"),
  'chartMask': new Color("F4590C"),
  'chartMaskLarge': new Color("F3570A"),
  'circleChartBase': new Color("96270E"),
  'circleChartPercent': new Color("331107"),
  'infosColor': Color.white(),
  'subtitleColor': new Color('ffffff'),
  'iconColor': new Color("B02709"),
  'separator': new Color('973012')
};

let black = {
  'bgGradient': getGradient("000000","222222"),
  'chartGradient':getGradient("3F23FF","701BC4"),
  'chartMask': new Color("161616"),
  'chartMaskLarge': new Color("141414"),
  'circleChartBase': new Color("6E19CA"),
  'circleChartPercent': new Color("3F22F9"),
  'infosColor': new Color("D9D9D9"),
  'subtitleColor': new Color('62638F'),
  'iconColor': new Color("484848"),
  'separator': new Color('876FC8')
};

let eva_shogoki = {
  'bgGradient': getGradient("5819E4","6A56FF"),
  'chartGradient':getGradient("1CD9B5","FFC028",0.5),
  'chartMask': new Color("633EF7"),
  'chartMaskLarge': new Color("633FF5"),
  'circleChartBase': new Color("FFE851"),
  'circleChartPercent': new Color("390C83"),
  'infosColor': Color.white(),
  'subtitleColor': new Color('D1C4FA'),
  'iconColor': new Color("390C83"),
  'separator': new Color('876FC8')
};

let peach = {
  'bgGradient': getGradient("E24279","EE8B9C"),
  'chartGradient':getGradient("40F1D1","40F1D1"),
  'chartMask': new Color("EA708F"),
  'chartMaskLarge': new Color("E96C8E"),
  'circleChartBase': new Color("FFE1E9"),
  'circleChartPercent': new Color("72CCBE"),
  'infosColor': Color.white(),
  'subtitleColor': Color.white(),
  'iconColor': new Color("84F9C3"),
  'separator': new Color('FF7A9E')
};

var themes = {
  'bluenight':blue_night,
  'blueorange':blue_orange,
  'orangered':orange_red,
  'black':black,
  'evashogoki': eva_shogoki,
  'peach':peach
}

/*-------------
    LAUNCH
-------------*/
let theme = themes[(args.widgetParameter === null)?"blueorange":args.widgetParameter];
let widget;
if (config.runsInWidget) {
  widget = await createWidget(datas,theme);
  Script.setWidget(widget);
} else {
  let res = await presentAlert('Preview Widget', OPTIONS);
  if (res===OPTIONS.length-1) return;

  let size = OPTIONS[res];
  widget = await createWidget(datas,theme,size.toLowerCase());
  await widget[`present${size}`]();
}
Script.complete();
