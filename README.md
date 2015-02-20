xapiscorecard
=============

Generate a scorecard as a csv file for a number of users and a number of xapi targets.

Summary
-------

This utility accepts a config file in yml format like this:

```
xapiEndpoint: <endpoint goes here>
xapiUsername: <username>
xapiPassword: <password>

emails:
- test@example.com
- test2@example.com
- test3@example.com

targets:
- http://example.com/target1
- http://example.com/target2
- http://example.com/target3
```

Based on this, it generates a csv file for import into a spreadsheet program. The targets will be columns
and the users will be rows, and each cell will contain the maximum score achieved for that user/target
combination.
