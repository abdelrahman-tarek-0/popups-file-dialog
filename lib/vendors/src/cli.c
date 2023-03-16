#include <stdio.h>
#include <string.h>
#include "tinyfiledialog/tinyfiledialogs.h"

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

#include <stdio.h>
#include <string.h>
#include "tinyfiledialog/tinyfiledialogs.h"

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

int main(int argc, char *argv[])
{

    if (strcmp(argv[1], "-open-file") == 0)
    {
        char const *lTheOpenFileName;
        char const *title = "";
        char const *startPath = "";
        char const *filterPatternsDescription = "";
        char *patternsRow;
        char const *patterns[50] = {};
        int iPatterns = 0;
        int isMulti = 0;
        char flags[][66] = {"--title", "--startPath", "--filterPatterns", "--filterPatternsDescription", "--allowMultipleSelects"};

        for (int i = 2; i < argc; i = i + 2)
        {
            if (argv[i] && checkStrInArr(flags, argv[i]) != -1)
            {
                if (!argv[i + 1])
                {
                    return printf("-066944 ~no value for %s detected~", argv[i]);
                }
                printf("found the flag %s --> %s in postion %d\n", argv[i], argv[i + 1], i);
                switch (checkStrInArr(flags, argv[i]))
                {
                case 0:
                {
                    title = replace_char(argv[i + 1], '`', ' ');
                    break;
                }
                case 1:
                {
                    startPath = argv[i + 1];
                    break;
                }
                case 2:
                {
                    patternsRow = argv[i + 1];
                    char *token = strtok(patternsRow, ",");
                    patterns[iPatterns] = token;
                    while (token != NULL)
                    {
                        iPatterns++;
                        token = strtok(NULL, ",");
                        patterns[iPatterns] = token;
                    }
                    break;
                }
                case 3:
                {
                    filterPatternsDescription = replace_char(argv[i + 1], '`', ' ');
                    break;
                }
                case 4:
                {
                    char *re = argv[i + 1];
                    if (strcmp(re, "1") == 0)
                    {
                        isMulti = 1;
                    }
                    break;
                }
                }
            }
        }
        printf("final version of the title: %s\n", title);
        printf("final version of the startPath: %s\n", startPath);
        printf("final version of the filterPatternsDescription: %s\n", filterPatternsDescription);
        printf("final version of the isMultipleSelects: %d\n", isMulti);

        printf("patterns count is %d with patterns:  ", iPatterns);
        for (int i = 0; i < iPatterns; i++)
        {
            printf("%s ", patterns[i]);
        }
        printf("\n");

        lTheOpenFileName = tinyfd_openFileDialog(title, startPath, iPatterns, patterns, filterPatternsDescription, isMulti);

        if (!lTheOpenFileName)
            printf("-066944 ~no file selected~");
        else
            printf("-066945 ~%s~", lTheOpenFileName);
    }

    return 0;
}

