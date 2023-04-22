---
title: How I Used Crontab To Schedule Jobs On Linux For My Work
date: "2023-02-14T00:00:00.000Z"
description: "Cron is a built-in system tool to schedule jobs on Linux. We will learn a piece of knowledge about it with my personal experience."
tag: 
    - Linux
---

![crontab-edit](../imgs/10/crontab-edit.png)

Linux users who set up and maintain software environment use `cron` to schedule jobs. It is the most suitable for repetitive tasks.

Among a few of servers I have developed and maintained, there is an application server that is run on a virtual machine and it is required to always listen on a port. However, the server is sometimes terminated for some reason. Thanks to `cron`, I did not have to manually restart it when it was off. So, I will share how to fix the problem by using `cron` in this post.

## Prerequisite
- Linux environment — _I will use Ubuntu here_
- A bit of knowledge about Linux — _simple commands or such_
- A bit of knowledge about bash script

## Real World Experience
One of my jobs at work is to develop and maintain the pipeline that has been automated to collect lots of data and process them as desired for my company's app service. 

For that task, we have a software product that crawls websites on a daily basis. Since its crawling jobs are a lot and very intense, it is often shut down in the middle of getting requests. So, we did not get enough data to present on our app. We had to find a way to fix this problem to get as much data as we want. 

The solution is _**sikulix**_ that can detect graphic images on a screen and make us able to do stuff with them such as click. Put it in a nutshell, it will open the crawling software if it is shut down and get it ready to get requests again.

We ran the sikulix server on a port. For the first few days, it worked as charm. It detected when the crawling software was shutdown and opened it automatically. 

But, the sikulix server itself was shutdown for some reason so, I had to find a way to automatically open the sikulix server if it was shutdown.

_**Very irritating, right?**_

Thankfully, we have `cron` and shell script that can solve problems. Now, I will talk about how I used those two utilities for the case.

## Simple Examples
1. `*/1 * * * * echo "Hello, World"`
2. ``50 1,2 * * * cd /home/cron_logs & touch cron-`date +\%F`.log``
3. `0 0 1* * find /home/cron_logs -name "*.log" -type f -mtime +30 -delete`

Before telling you what I tried, it is probably good to know some basics. Let's look at these simple examples of scheduled jobs with `cron`. As you can see, one line is comprised of two parts. One is for time scheduling and the other is the command that you want to execute on the scheduled time.

So, what happens here:

1. _**"Hello, World"**_ will be printed out on logs every 1 minute
2. A file named cron_[_date when the command is run_].log will be created under a folder named **cron_logs** in home directory at 1:50 and 2:50 a.m. everyday
3. Files whose names have log in them, which are older than 30 days from now, under a folder named **cron_logs** will be removed at midnight every first day of a month

## How To Fix
The approach I tried for the problem here is to check out if the _**sikulix**_ server is run a few minutes before it does its job. If not, we would just run it again. Here is what I did to achieve the goal:

1. Open the terminal and enter to edit cron job
```bash
crontab -e
// edit cron jobs
```

2. Write the code in the editor when prompted
```bash
50 2,5,20,23 * * * /home/sikulix/handle_sikulix.sh >> ~/cron_logs/cron-`date +\%F`.log 2>&1
```

> Notice that I used the absolute path of the shell script I wanted to execute. Cron does not know where a file is, if only the name of a file presented.

To finish, press ctrl+x.

3. Restart cron
```bash
sudo systemcrl restart cron
```

To make the cron job work out, we need to restart `cron` on a system level.

4. Create handle_sikulix.sh
```bash
#!/bin/bash

isRun="YES"
$(sudo netstat -tulpn | grep :[SIKULIX SERVER PORT] > /dev/null) || isRun=""

if [ "$isRun" = "YES" ]; then
    echo "Autorun server is running"
else
    export DISPLAY=:10.0
    cd /home/sikulix
    ./start_server.sh;bash
fi
```
What this shell script does is that after checking out if the port the server is run on is being used or not. 

If used, it will just print out _"**Autorun server is running**"_ in a log file under the folder named **cron_logs**. Or if not, it changes the directory of _**sikulix**_ and runs the shell script named `start_server.sh`, which starts the skulix server.

## Conclusion
_**Cron**_ is actually not difficult to understand. All you need to do is to learn how to schedule time by its rule and write commands you want to execute as you desire. Simply put, `cron` is just about how we can cleverly make a good use of it.

_**THANKS FOR READING. SEE YOU NEXT TIME!**_

_This is originally posted on my [Medium](https://medium.com/@shkim04/how-i-used-crontab-to-schedule-jobs-on-linux-for-my-work-1cb290847904)._
_Let's connect!_