#include <stdio.h>
#include <string.h>
#include "tinyfiledialogs.h"

int checkStrInArr(char x[][66], char *s)
{
    int i;
    for (i = 0; i < 5; ++i)
    {
        if (!strcmp(x[i], s))
        {
            return i;
        }
    }
    return -1;
}

char *replace_char(char *str, char find, char replace)
{
    char *current_pos = strchr(str, find);
    while (current_pos)
    {
        *current_pos = replace;
        current_pos = strchr(current_pos, find);
    }
    return str;
}


char *replace_str(char *str, char *orig, char *rep, int start)
{
  static char temp[4096];
  static char buffer[4096];
  char *p;

  strcpy(temp, str + start);

  if(!(p = strstr(temp, orig)))  // Is 'orig' even in 'temp'?
    return temp;

  strncpy(buffer, temp, p-temp); // Copy characters from 'temp' start to 'orig' str
  buffer[p-temp] = '\0';

  sprintf(buffer + (p - temp), "%s%s", rep, p + strlen(orig));
  sprintf(str + start, "%s", buffer);    

  return str;
}

