const { Snowflake } = require('@theinternetfolks/snowflake');

function generateId(){
    return Snowflake.generate()
}

module.exports = { generateId }