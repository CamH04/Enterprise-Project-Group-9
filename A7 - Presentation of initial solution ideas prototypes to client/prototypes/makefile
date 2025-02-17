CC = g++
CFLAGS = -std=c++11 -Wall
LIBS = -lzip -ltinyxml2
SRCS = doc_to_txt_parcer.cpp
OBJS = $(SRCS:.cpp=.o)
EXEC = doc_to_txt_parcer

.PHONY: all clean run

all: $(EXEC)

$(EXEC): $(OBJS)
	$(CC) $(CFLAGS) -o $(EXEC) $(OBJS) $(LIBS)

%.o: %.cpp
	$(CC) $(CFLAGS) -c $< -o $@

run: $(EXEC)
	./$(EXEC)

clean:
	rm -f $(OBJS) $(EXEC)
