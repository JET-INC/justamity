typedef struct node {
  char *data;
  struct node *next;
} Node;

void remove_head(Node **list);