# If you want to register a new user to database, first fill its data using:
`deno run -A twttier_follow_put_db.ts`

# Once we grabbed his follows, we can check his new follows easily
`deno task alert_new_follow`

# Run with pm2 daemon
`pm2 start pm2_config.json`

## Check pm2 apps
`pm2 logs`

