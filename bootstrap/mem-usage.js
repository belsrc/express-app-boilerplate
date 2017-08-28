module.exports = function(app) {
  // Console Colors
  const BLUE = '\x1b[34m';
  const RED = '\x1b[91m';
  const NONE = '\x1b[0m';

  // Human readable tiers
  const tiers = [ 'byte', 'KB', 'MB', 'GB', 'TB' ];

  /**
   * Get the human readable size tier [byte, KB, MB, GB, TB].
   * @private
   * @param  {Int}    size   Memory size in bytes.
   * @param  {Number} round  The number of check rounds.
   * @return {Object} Returns an object containing size & affix.
   */
  function getTier(size, round) {
    round = round || 0;

    if(round >= tiers.length) {
      return {
        size,
        affix: tiers[tiers.length - 1],
      };
    }

    if(size > 1024) {
      return getTier(size / 1024, round + 1);
    }

    return {
      size,
      affix: tiers[round],
    };
  }

  /**
   * Display the memory usage.
   * @private
   * @param  {String} label  The memory type label.
   * @param  {Number} size   The humanable memory size.
   * @param  {String} affix  The humanable size affix.
   * @return
   */
  function displayUsage(label, size, affix) {
    console.log(`${ RED }Memory: ${ label } - ${ BLUE }${ Math.ceil(size * 100) / 100 } ${ affix }${ NONE }`);
  }

  app.use((request, response, next) => {
    const mem = process.memoryUsage();
    const rss = getTier(mem.rss);
    const heap = getTier(mem.heapUsed);

    displayUsage(`${ NONE }Resident Set Size`, rss.size, rss.affix);
    displayUsage(`${ NONE }Heap Size`, heap.size, heap.affix);

    return next();
  });
};
