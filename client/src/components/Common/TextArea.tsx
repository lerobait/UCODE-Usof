import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, ListItemDecorator } from '@mui/joy';
import { FaBold, FaItalic, FaArrowDown, FaCheck } from 'react-icons/fa';
interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  placeholder: string;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  placeholder,
}) => {
  const [charCount, setCharCount] = useState<number>(value.length);
  const [italic, setItalic] = useState(false);
  const [fontWeight, setFontWeight] = useState('normal');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 10000) {
      setCharCount(newValue.length);
      onChange(e);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    onChange({
      target: { value: value + emoji },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <div>
      <label htmlFor="content" className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <textarea
          id="content"
          value={value}
          onChange={handleChange}
          rows={6}
          maxLength={10000}
          className="w-full border rounded px-2 py-1 resize-none"
          placeholder={placeholder}
          style={{
            overflowY: value.length > 600 ? 'auto' : 'hidden',
            fontWeight: fontWeight,
            fontStyle: italic ? 'italic' : 'initial',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            pt: '8px',
            borderTop: '1px solid',
            borderColor: 'divider',
            alignItems: 'center',
          }}
        >
          <IconButton
            variant="plain"
            color="neutral"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <FaBold />
            <FaArrowDown fontSize="medium" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            size="sm"
            placement="bottom-start"
          >
            {['200', 'normal', 'bold'].map((weight) => (
              <MenuItem
                key={weight}
                selected={fontWeight === weight}
                onClick={() => {
                  setFontWeight(weight);
                  setAnchorEl(null);
                }}
                sx={{ fontWeight: weight }}
              >
                <ListItemDecorator>
                  {fontWeight === weight && <FaCheck fontSize="small" />}
                </ListItemDecorator>
                {weight === '200' ? 'lighter' : weight}
              </MenuItem>
            ))}
          </Menu>

          <IconButton
            variant={italic ? 'soft' : 'plain'}
            color={italic ? 'primary' : 'neutral'}
            aria-pressed={italic}
            onClick={() => setItalic((prev) => !prev)}
          >
            <FaItalic />
          </IconButton>

          <IconButton onClick={() => handleEmojiClick('😍')} color="neutral">
            <span>😍</span>
          </IconButton>

          <IconButton onClick={() => handleEmojiClick('😂')} color="neutral">
            <span>😂</span>
          </IconButton>

          <IconButton onClick={() => handleEmojiClick('👀')} color="neutral">
            <span>👀</span>
          </IconButton>

          <div
            style={{ marginLeft: 'auto', fontSize: '0.875rem', color: 'gray' }}
          >
            {charCount} / 10000
          </div>
        </Box>
      </Box>
    </div>
  );
};

export default TextArea;
