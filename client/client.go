package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"time"

	"chatapp/message"

	"github.com/gorilla/websocket"
)

const serverAddr = "ws://localhost:8080/ws"

func main() {
	conn, _, err := websocket.DefaultDialer.Dial(serverAddr, nil)
	if err != nil {
		log.Fatalf("Error connecting to WebSocket server: %v", err)
	}
	defer conn.Close()

	fmt.Print("Enter your username: ")
	username := readInput()

	go readMessages(conn)
	sendMessages(conn, username)
}

func readInput() string {
	reader := bufio.NewReader(os.Stdin)
	input, _ := reader.ReadString('\n')
	return input[:len(input)-1]
}

func readMessages(conn *websocket.Conn) {
	for {
		var msg message.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			return
		}
		fmt.Printf("Username: %s\nMessage: %s\n\n", msg.Username, msg.Content)
	}
}

func sendMessages(conn *websocket.Conn, username string) {
	for {
		//fmt.Print("\nEnter message: ")
		text := readInput()

		msg := message.Message{
			Username: username,
			Content:  text,
		}

		err := conn.WriteJSON(msg)
		if err != nil {
			log.Fatalf("Error sending message: %v", err)
			return
		}

		time.Sleep(time.Millisecond * 100)
	}
}
