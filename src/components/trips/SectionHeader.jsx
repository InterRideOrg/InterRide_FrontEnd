import { Box, Typography, Link } from '@mui/material';

export default function SectionHeader({ title, onViewAll }) {
  return (
    <Box display="flex" alignItems="center" mb={1.5}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>

      {onViewAll && (
        <Link
          component="button"
          underline="hover"
          sx={{ fontSize: 14, fontWeight: 600 }}
          onClick={onViewAll}
        >
          Ver Todos
        </Link>
      )}
    </Box>
  );
}
