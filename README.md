#dota-2-api-mongo
Example project using [dota-2-api](https://github.com/daynekilheffer/dota-2-api) to insert a match into a mongo db

##Setup

This project expects a few variables to be available in the environment.

Before you can run this project, export the following values:
```
export mongouser=<name>
export mongopass=<pass>
export mongohost=<host>
export mongodb=<db>
```

or

Update `config.js` to not use process.env anymore.
- - -
I personally have been experimenting with [mongohq](https://www.mongohq.com/)'s [sandbox database](https://www.mongohq.com/pricing/).  If you are looking for a simple database setup to test this project out, head over and check it out.
