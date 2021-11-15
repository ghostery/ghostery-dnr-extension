/**
 * Ghostery Browser Extension
 * https://www.ghostery.com/
 *
 * Copyright 2017-present Ghostery GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0
 */

// This global provides an API like an ES Map but will sync
// with local storage from time to time. That is done to prevent
// loosing all/ stats when the browser terminates the execution
// context (background script or service worker).
const tabStats = (() => {

  // Source: https://stackoverflow.com/a/60467595/783510
  // License: free to use
  //
  //  A formatted version of a popular md5 implementation.
  //  Original copyright (c) Paul Johnston & Greg Holt.
  //  The function itself is now 42 lines long.
  //
  // ----------------------------------------------------------------------
  //
  // Modifications:
  // * Added the option to truncate the hash. By default, md5 is 16 bytes (128 bit).
  //   To force collisions, you can truncate to 8 bytes (64 bit) or 4 bytes (32 bit).
  // * This is a simple implementation and does not force a async API as crypto.subtle.
  // * For use cases with higher performance requirements, more complex libraries
  //   exist, for instance: https://www.npmjs.com/package/hash-wasm
  //
  /* eslint-disable prettier/prettier */
  function md5_(inputString, truncate) {
      var hc="0123456789abcdef";
      function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
      function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
      function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
      function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
      function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
      function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
      function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
      function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
      function sb(x) {
          var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
          for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
          blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
      }
      var i,x=sb(inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
      for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
          a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
          b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
          c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
          d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
          a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
          b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
          c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
          d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
          a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
          b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
          c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
          d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
          a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
          b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
          c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
          d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
          a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
          b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
          c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
          d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
          a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
          b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
      }

      if (truncate === 4) {
        return rh(a);
      }
      if (truncate === 8) {
        return rh(a)+rh(b);
      }

      return rh(a)+rh(b)+rh(c)+rh(d);
  }
  /* eslint-enable prettier/prettier */

  /**
   * Standard MD5 algorithm:
   *
   * md5('Test') -> '0cbc6611f5540bd0809a388dc95a615b'
   */
  function md5(inputString) {
    return md5_(inputString);
  }

  /**
   * MD5 algorithm truncated to 8 bytes (result is hex encoded, thus 16 chars):
   *
   * md5('Test') -> '0cbc6611f5540bd0'
   */
  function firstEightBytesOfMd5(inputString) {
    return md5_(inputString, 8);
  }

  /**
   * MD5 algorithm truncated to 4 bytes (result is hex encoded, thus 8 chars):
   *
   * md5('Test') -> '0cbc6611'
   */
  function firstFourBytesOfMd5(inputString) {
    return md5_(inputString, 4);
  }

  class AutoSyncingMap {
    constructor({
      storageKey,
      softFlushIntervalInMs = 200,
      hardFlushIntervalInMs = 1000,
      ttlInMs = 7 * 24 * 60 * 60 * 1000, /* 1 week */
      maxEntries = 5000,
      keyMapper = (x) => x,   /* default: no custom key mapping logic */
      checksum = (x) => null, /* default: disabled */
    }) {
      if (!storageKey) {
        throw new Error('Missing storage key');
      }
      if (!checksum) {
        throw new Error('Missing key mapper');
      }
      this.storageKey = storageKey;
      this.inMemoryMap = new Map();
      this._initialSyncComplete = false;
      this.maxEntries = maxEntries;

      // If you use normal keys that can be directly persisted
      // (e.g. Strings or number), you can ignore it and use the default
      // (the identity function).
      //
      // The use case where you want to overwrite is when you do
      // not want that the natural key is persisted. For example,
      // if the key consists sensitive information that you do not
      // want to store in cleartext.
      this._keyMapper = keyMapper;

      // To detect collisions, you can define an optional checksum.
      // It takes the original key (before running the custom mapper)
      // as input. By default, checksumming is disabled.
      //
      // If you are defining a checksum, the semantic is to silently
      // ignore entries that fail the checksum.
      this._checksum = checksum;

      // Make sure old entries that were not cleaned up are eventually
      // removed. Otherwise, we could exceed the local storage quota.
      // Plus, when the maps get big, serializing and deserializing
      // may become expensive. If the actively triggered clean up works,
      // there should be no need to make this expiration too aggressive.
      this.ttlInMs = ttlInMs;
      this._ttlMap = new Map();

      // Flush handling logic: the difference between both limits is that
      // the soft limit does not guarantee that a flush will eventually
      // be performed. After each write operation, it will reset the soft
      // timeout and then flush. Thus, if you keep writing, it will never
      // flush. The hard limit, on the other hand, forces that data gets
      // persisted, but could result in ill-timed write operations.
      //
      // If there are bursts of operations, ideally you want to flush
      // at the end of the burst. The soft limit will result in that,
      // while the hard limit mitigates the risk that the script
      // gets killed before the data gets persisted.
      //
      // Rule of thumbs:
      // * The soft limit should be lower then the hard limit
      // * The hard limit should not be set too high. Remember, it is
      //   the protection against the browser unpredictably killing
      //   the execution.
      this.softFlushIntervalInMs = softFlushIntervalInMs;
      this.hardFlushIntervalInMs = hardFlushIntervalInMs;
      this._scheduledFlush = null;
      this._lastFlush = Date.now();
      this._dirty = false;

      // Assumption: there should be enough time during startup to load
      // the persisted map. Otherwise, the state will be inconsistent
      // whenever the script is loaded (it will eventually become consistent,
      // but that will not help if the browser kills it quickly).
      //
      // (If that assumption does not hold, _warnIfOutOfSync will detect
      // and log it. A potential improvement could be to treat the
      // in-memory map as the source of truth in that scenario.)
      this._pending = new Promise((resolve, reject) => {
        chrome.storage.local.get([this.storageKey], (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            const { entries = {}, ttl = {} } = result[this.storageKey] || {};
            this.inMemoryMap = new Map(Object.entries(entries));
            this._ttlMap = new Map(Object.entries(ttl));
            this._initialSyncComplete = true;
            this.expireOldEntries();
            resolve();
          }
        });
      });
    }

    _warnIfOutOfSync() {
      if (!this._initialSyncComplete) {
        console.warn('AutoSyncingMap: out of sync (loading is too slow...)');
      }
    }

    get(_key) {
      this._warnIfOutOfSync();
      const key = this._normalizeKey(_key);
      const value = this.inMemoryMap.get(key);
      if (!value) {
        return undefined;
      }

      const expectedChecksum = this._checksum(_key);
      if (expectedChecksum) {
        const { checksum } = this._ttlMap.get(key);
        if (checksum !== expectedChecksum) {
          console.debug('Checksum does not match: expected:', expectedChecksum, ' actual:', checksum);
          return undefined;
        }
      }

      return value;
    }

    set(_key, value) {
      this._warnIfOutOfSync();

      // This should never trigger. Yet if the maps run full (perhaps
      // as a side-effect of a bug), better reset then continuing with
      // these huge maps.
      if (this.inMemoryMap.size >= this.maxEntries || this._ttlMap.size >= this.maxEntries) {
        console.warn('AutoSyncingMap: Maps are running full (maybe you found a bug?). Purging data to prevent performance impacts.');
        this.inMemoryMap.clear();
        this._ttlMap.clear();
      }

      const key = this._normalizeKey(_key);
      const checksum = this._checksum(_key);
      console.debug(`AutoSyncingMap: set(${key}, ...)`);
      this.inMemoryMap.set(key, value);
      this._ttlMap.set(key, {
        expireAt: Date.now() + this.ttlInMs,
        checksum: this._checksum(_key)
      });
      this._markAsDirty();
    }

    delete(_key) {
      this._warnIfOutOfSync();
      const key = this._normalizeKey(_key);
      const wasDeleted = this.inMemoryMap.delete(key);
      if (wasDeleted) {
        this._ttlMap.delete(key);
        this._markAsDirty();
      }
      return wasDeleted;
    }

    clear() {
      this._warnIfOutOfSync();
      this.inMemoryMap.clear();
      this._ttlMap.clear();

      this._scheduleAction(new Promise((resolve, reject) => {
          chrome.storage.local.remove(this.storageKey, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
      }));
      this._dirty = false;
    }

    expireOldEntries() {
      const now = Date.now();
      let count = 0;

      function isExpired({ expireAt }) {
        if (!expireAt) {
          return true; // also delete broken entries
        }
        return now >= expireAt;
      }

      for (const [key, ttlEntry] of this._ttlMap.entries()) {
        if (isExpired(ttlEntry)) {
          this.inMemoryMap.delete(key);
          this._ttlMap.delete(key);
          count += 1;
        }
      }

      if (count > 0) {
        console.log('AutoSyncingMap: expired', count, 'entries.');
        this._markAsDirty();
      }
      return count;
    }

    // Normalize numbers as strings to prevent nasty pitfalls
    // (ES6 maps support numbers, but after serializing and
    // deserializing, we end up with strings and cannot find
    // the "number" key)
    _normalizeKey(_key) {
      const key = this._keyMapper(_key);
      if (typeof key === 'number') {
        return key.toString();
      }
      if (typeof key === 'string') {
        return key;
      }
      throw new Error(`Unexpected key type (type: ${typeof key}, value: ${key})`);
    }

    _markAsDirty() {
      const now = Date.now();
      if (!this._dirty) {
        this._lastFlush = now;
        this._dirty = true;
      }

      const nextForcedFlush = this._lastFlush + this.hardFlushIntervalInMs;
      clearTimeout(this._scheduledFlush);
      if (now >= nextForcedFlush) {
        this._flush();
        this._scheduledFlush = null;
      } else {
        this._scheduledFlush = setTimeout(() => {
          this._flush();
          this._scheduledFlush = null;
        }, Math.min(this.softFlushIntervalInMs, nextForcedFlush - now));
      }
    }

    _flush() {
      if (!this._dirty) {
        return;
      }

      this._scheduleAction(new Promise((resolve, reject) => {
        if (!this._dirty) {
          resolve();
          return;
        }

        this._dirty = false;
        const serialized = {
          entries: Object.fromEntries(this.inMemoryMap),
          ttl: Object.fromEntries(this._ttlMap),
        };
        chrome.storage.local.set({ [this.storageKey]: serialized }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            this._lastFlush = Date.now();
            console.debug('AutoSyncingMap: flushed');
            resolve();
          }
        });
      }));
    }

    _scheduleAction(action) {
      const lastSyncPoint = this._pending;
      this._pending = lastSyncPoint.then(action).catch(console.error);
      return this._pending;
    }
  }

  // If you bump this number, the extension will start with a
  // clean state. Normally, this should not be needed.
  const autoSyncVersion = 2;
  const storageKey = `tabStats:v${autoSyncVersion}`;

  // For the tabStats, we are only interested in the last value
  // for each tab. Also, for privacy reason, we should avoid
  // storing the full URL on disk. For detecting non-matching URLs,
  // we rely on the additional checksum.
  function keyMapper({ tabId, url }) {
    if (tabId === undefined) {
      throw new Error('Expected tabId');
    }
    if (url === undefined) {
      throw new Error('Expected url');
    }
    return tabId;
  }

  function checksum({ tabId, url }) {
    const parsedUrl = new URL(url);
    const cleanUrl = parsedUrl.origin + parsedUrl.pathname;

    // This hash function is intentionally weak.
    // We want to have collisions for plausible deniability.
    return firstFourBytesOfMd5(`${tabId}:${cleanUrl}`);
  };
  return new AutoSyncingMap({ storageKey, keyMapper, checksum });
})();
