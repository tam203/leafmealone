define(['dojo/_base/lang',
    'dojo/_base/Deferred'], function (lang, Deferred) {
    return {
        _deferred:null,

        getLocation:function()
        {
            if(!this._deferred){
                this._deferred = new Deferred();
                if (navigator.geolocation)
                {
                    navigator.geolocation.getCurrentPosition(lang.hitch(this, this._gotPositionHandler));
                }
                else{
                    this._deferred.reject(null);
                }
            }
            return this._deferred;

        },

        _gotPositionHandler:function(position)
        {
            this._deferred.resolve({
                lat:position.coords.latitude,
                lon:position.coords.longitude
            });
        }
    };
});