#!/bin/bash

SESSION=$USER

BABEL_COMMAND="clear &&./node_modules/.bin/babel ./src  --out-dir dist --extensions \".ts\"  --watch --verbose"
NODE_COMMAND="sleep 2 && ./node_modules/.bin/nodemon -x  \"clear && node dist/app.js\""

tmux  new-session -d -s $SESSION
tmux new-window -t $SESSION:1 -n 'Watching node App'

tmux split-window -h
 
tmux select-pane -t 1  
tmux split-window 


tmux select-pane -t 1
tmux send-keys "$BABEL_COMMAND" C-m

tmux select-pane -t 2
tmux send-keys "pkill tmux"
tmux split-window 

tmux select-pane -t 3
tmux clock-mode 


tmux select-pane -t 0
tmux send-keys "$NODE_COMMAND" C-m

tmux setw -t -g mouse on

tmux attach-session -t $SESSION

