import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as d3 from 'd3'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme, useMediaQuery } from '@mui/material'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { useLanguage } from '../../../shared/context/useLanguage'
import GenealogyModal from './GenealogyModal'

// Detect gender based on name patterns (biblical names)
const detectGender = (name) => {
  const maleNames = ['Adam', 'Seth', 'Enosh', 'Kenan', 'Mahalalel', 'Jared', 'Enoch', 'Methuselah', 'Lamech', 'Noah', 'Shem', 'Ham', 'Japheth', 'Abraham', 'Isaac', 'Jacob', 'Judah', 'Levi', 'David', 'Solomon']
  const femaleNames = ['Eve', 'Noa', 'Bathsheba', 'Ruth', 'Leah', 'Rachel', 'Sarah', 'Rebekah', 'Esther', 'Hannah']
  
  const nameEn = name || ''
  
  // Check explicit names
  if (femaleNames.some(f => nameEn.toLowerCase().includes(f.toLowerCase()))) return 'female'
  if (maleNames.some(m => nameEn.toLowerCase().includes(m.toLowerCase()))) return 'male'
  
  // Check name patterns
  if (nameEn.toLowerCase().includes('wife') || nameEn.toLowerCase().includes('daughter')) return 'female'
  
  return 'male' // default
}

export default function D3Chart({ genealogyData, loading = false }) {
  const svgRef = useRef()
  const gRef = useRef()
  const zoomRef = useRef()
  const { language } = useLanguage()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [selectedNode, setSelectedNode] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isVertical, setIsVertical] = useState(true)
  const [lineStyle, setLineStyle] = useState('curved')
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  // Search function - supports bilingual search
  const searchNodes = useCallback((data, term) => {
    if (!term.trim()) return new Set()

    const results = new Set()
    const searchLower = term.toLowerCase()

    function traverse(node) {
      const nameEn = (node.nameEn || '').toLowerCase()
      const nameTe = (node.nameTe || '').toLowerCase()

      if (nameEn.includes(searchLower) || nameTe.includes(searchLower)) {
        results.add(node.id || node.nameEn)
      }

      if (node.children) {
        node.children.forEach((child) => traverse(child))
      }
    }

    if (data) traverse(data)
    return results
  }, [])

  // Toggle node expansion
  const toggleNodeExpansion = useCallback((nodeId) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }, [])

  // Prepare data with expanded/collapsed children
  const prepareData = useCallback((data) => {
    if (!data) return data
    
    const processNode = (node) => {
      const nodeId = node.id || node.nameEn
      const isExpanded = expandedNodes.has(nodeId)
      
      // Move _children to children if expanded, or vice versa if collapsed
      if (node._children && isExpanded) {
        node.children = node._children
        node._children = []
      } else if (node.children && node.children.length === 0 && node._children && node._children.length > 0) {
        node._children = node.children
      } else if (node._children && !isExpanded && node.children && node.children.length > 0) {
        // Store visible children in _children if we need to collapse
        const temp = node._children
        node._children = node.children
        node.children = temp
      }
      
      // Recursively process children
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child) => processNode(child))
      }
      if (node._children && Array.isArray(node._children)) {
        node._children.forEach((child) => processNode(child))
      }
      
      return node
    }
    
    return processNode(JSON.parse(JSON.stringify(data)))
  }, [expandedNodes])

  // Generate tree layout with better spacing
  const generateTreeLayout = useCallback(() => {
    if (!svgRef.current || !genealogyData) return

    // Define getName inside the callback to avoid dependency issues
    const getName = (node) => {
      if (language === 'te' && node.nameTe) return node.nameTe
      return node.nameEn || node.name || 'Unknown'
    }

    const preparedData = prepareData(genealogyData)

    const nodeRadius = 56
    const levelHeight = 280
    const siblingDistance = 320

    // Create hierarchy
    const hierarchy = d3.hierarchy(preparedData)

    // Create tree layout with larger spacing
    let treeLayout
    if (isVertical) {
      treeLayout = d3.tree().nodeSize([siblingDistance, levelHeight])
    } else {
      treeLayout = d3.tree().nodeSize([levelHeight, siblingDistance])
    }

    const root = treeLayout(hierarchy)

    // Calculate bounds
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity
    root.each((node) => {
      minX = Math.min(minX, node.x)
      maxX = Math.max(maxX, node.x)
      minY = Math.min(minY, node.y)
      maxY = Math.max(maxY, node.y)
    })

    const padding = 100
    const totalWidth = maxX - minX + padding * 2
    const totalHeight = maxY - minY + padding * 2

    // Clear SVG
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.attr('viewBox', `${minX - padding} ${minY - padding} ${totalWidth} ${totalHeight}`)

    const g = svg.append('g')
    gRef.current = g

    // Add zoom behavior
    const zoom = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

    zoomRef.current = zoom
    svg.call(zoom)

    // Get searched node IDs
    const searchResults = searchNodes(genealogyData, searchTerm)

    // Draw links (curved, square, or linear paths)
    const getLinkPath = () => {
      if (lineStyle === 'linear') {
        return d3.linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
          .curve(d3.curveLinear)
      } else if (lineStyle === 'square') {
        return d3.linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
          .curve(d3.curveStepAfter)
      } else {
        // curved (default)
        return d3.linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      }
    }

    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', getLinkPath())
      .style('stroke', (d) => {
        // Check if source AND target both have messianicLine class
        const sourceClass = d.source.data.class || ''
        const targetClass = d.target.data.class || ''
        return (sourceClass.includes('messianicLine') && targetClass.includes('messianicLine')) 
          ? '#9333EA'  // purple for messianicLine connections
          : '#999'     // grey for other lines
      })
      .style('stroke-width', (d) => {
        // Thicker lines for messianicLine connections
        const sourceClass = d.source.data.class || ''
        const targetClass = d.target.data.class || ''
        return (sourceClass.includes('messianicLine') && targetClass.includes('messianicLine')) 
          ? 10  // thick for messianicLine
          : 5   // normal for others
      })
      .style('fill', 'none')
      .style('opacity', 0.7)

    // Draw nodes
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)

    // Determine gender and color
    const getNodeColor = (d) => {
      if (searchResults.has(d.data.id || d.data.nameEn)) return '#FF6B6B' // red for search results
      const nodeClass = d.data.class || ''
      // If class contains "Israel", "major", or "messianicLine" → orange, otherwise → green
      return (nodeClass.includes('Israel') || nodeClass.includes('major') || nodeClass.includes('messianicLine')) 
        ? '#F97316'  // orange for Israel/major/messianicLine
        : '#10B981'  // green for others
    }

    const getNodeShape = (d) => {
      const gender = detectGender(d.data.nameEn || d.data.name)
      return gender === 'female' ? 'circle' : 'square'
    }

    // Add shapes (squares for males, circles for females)
    nodes.each(function (d) {
      const shape = getNodeShape(d)
      const color = getNodeColor(d)

      if (shape === 'circle') {
        // Female - Circle
        d3.select(this)
          .append('circle')
          .attr('r', nodeRadius)
          .style('fill', color)
          .style('stroke', '#fff')
          .style('stroke-width', 2.5)
          .style('cursor', 'pointer')
          .style('transition', 'all 0.2s')
          .on('click', (event, data) => {
            setSelectedNode(data.data)
            setShowModal(true)
          })
          .on('mouseover', function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', nodeRadius + 10)
              .style('filter', 'drop-shadow(0 0 8px rgba(0,0,0,0.3))')
          })
          .on('mouseout', function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('r', nodeRadius)
              .style('filter', 'none')
          })
      } else {
        // Male - Square
        d3.select(this)
          .append('rect')
          .attr('x', -nodeRadius)
          .attr('y', -nodeRadius)
          .attr('width', nodeRadius * 2)
          .attr('height', nodeRadius * 2)
          .attr('rx', 4)
          .style('fill', color)
          .style('stroke', '#fff')
          .style('stroke-width', 2.5)
          .style('cursor', 'pointer')
          .style('transition', 'all 0.2s')
          .on('click', (event, data) => {
            setSelectedNode(data.data)
            setShowModal(true)
          })
          .on('mouseover', function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('x', -nodeRadius - 10)
              .attr('y', -nodeRadius - 10)
              .attr('width', nodeRadius * 2 + 20)
              .attr('height', nodeRadius * 2 + 20)
              .style('filter', 'drop-shadow(0 0 8px rgba(0,0,0,0.3))')
          })
          .on('mouseout', function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('x', -nodeRadius)
              .attr('y', -nodeRadius)
              .attr('width', nodeRadius * 2)
              .attr('height', nodeRadius * 2)
              .style('filter', 'none')
          })
      }
    })

    // Add labels below with rounded white background
    nodes.each(function (d) {
      const name = getName(d.data)
      const displayName = name.length > 12 ? name.substring(0, 12) + '...' : name
      
      // Estimate text dimensions for background
      const estimatedCharWidth = 18 // approximately 32px * 0.56
      const textWidth = displayName.length * estimatedCharWidth
      const padding = 10
      const bgWidth = textWidth + padding * 2
      const bgHeight = 48 // 32px font + padding
      
      // Add white rounded background rectangle
      d3.select(this)
        .append('rect')
        .attr('x', -bgWidth / 2)
        .attr('y', nodeRadius + 20)
        .attr('width', bgWidth)
        .attr('height', bgHeight)
        .attr('rx', 6)
        .attr('ry', 6)
        .style('fill', 'white')
        .style('stroke', 'none')
        .style('pointer-events', 'none')
      
      // Add text on top of background
      d3.select(this)
        .append('text')
        .attr('x', 0)
        .attr('y', nodeRadius + 45)
        .style('text-anchor', 'middle')
        .style('font-size', '32px')
        .style('font-weight', 700)
        .style('fill', '#000')
        .style('pointer-events', 'none')
        .text(displayName)
      
      // Add expand/collapse icon if node has hidden children
      const nodeId = d.data.id || d.data.nameEn
      const hasHiddenChildren = d.data._children && d.data._children.length > 0
      const isExpanded = expandedNodes.has(nodeId)
      
      if (hasHiddenChildren || d.data.children?.length > 0) {
        const iconSymbol = (hasHiddenChildren && !isExpanded) ? '+' : (isExpanded && hasHiddenChildren) ? '−' : ''
        
        if (iconSymbol) {
          // Add circle background for icon at bottom-right corner
          d3.select(this)
            .append('circle')
            .attr('cx', nodeRadius + 15)
            .attr('cy', nodeRadius + 15)
            .attr('r', 12)
            .style('fill', '#4F46E5')
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('click', (event) => {
              event.stopPropagation()
              toggleNodeExpansion(nodeId)
            })
            .on('mouseover', function () {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 14)
                .style('filter', 'drop-shadow(0 0 4px rgba(0,0,0,0.3))')
            })
            .on('mouseout', function () {
              d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 12)
                .style('filter', 'none')
            })
          
          // Add icon text
          d3.select(this)
            .append('text')
            .attr('x', nodeRadius + 15)
            .attr('y', nodeRadius + 20)
            .style('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .style('pointer-events', 'none')
            .text(iconSymbol)
        }
      }
    })
  }, [genealogyData, language, searchTerm, isVertical, searchNodes, expandedNodes, prepareData, lineStyle, toggleNodeExpansion])

  useEffect(() => {
    generateTreeLayout()
  }, [genealogyData, searchTerm, isVertical, searchNodes, lineStyle, expandedNodes, generateTreeLayout])

  const handleZoom = useCallback((factor) => {
    if (!svgRef.current || !zoomRef.current) return
    const svg = d3.select(svgRef.current)
    
    svg
      .transition()
      .duration(300)
      .call(zoomRef.current.scaleBy, factor)
  }, [])

  const handleReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    const svg = d3.select(svgRef.current)
    
    svg
      .transition()
      .duration(300)
      .call(zoomRef.current.transform, d3.zoomIdentity)
  }, [])

  const handleDownload = () => {
    const svg = svgRef.current
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'genealogy-tree.svg'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!genealogyData) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        No genealogy data available
      </Paper>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Controls */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder={language === 'te' ? 'పేరు ద్వారా శోధించండి' : 'Search by name...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: '200px' }}
          />

          <ButtonGroup variant="contained" size="small">
            <Tooltip title={language === 'te' ? 'నిలువు' : 'Vertical'}>
              <Button
                onClick={() => setIsVertical(true)}
                variant={isVertical ? 'contained' : 'outlined'}
              >
                V
              </Button>
            </Tooltip>
            <Tooltip title={language === 'te' ? 'సమాంతర' : 'Horizontal'}>
              <Button
                onClick={() => setIsVertical(false)}
                variant={!isVertical ? 'contained' : 'outlined'}
              >
                H
              </Button>
            </Tooltip>
          </ButtonGroup>

          <ButtonGroup variant="contained" size="small">
            <Tooltip title={language === 'te' ? 'వక్ర రేఖ' : 'Curved Lines'}>
              <Button
                onClick={() => setLineStyle('curved')}
                variant={lineStyle === 'curved' ? 'contained' : 'outlined'}
              >
                Curved
              </Button>
            </Tooltip>
            <Tooltip title={language === 'te' ? 'చదరపు రేఖ' : 'Square Lines'}>
              <Button
                onClick={() => setLineStyle('square')}
                variant={lineStyle === 'square' ? 'contained' : 'outlined'}
              >
                Square
              </Button>
            </Tooltip>
            <Tooltip title={language === 'te' ? 'సరళ రేఖ' : 'Linear Lines'}>
              <Button
                onClick={() => setLineStyle('linear')}
                variant={lineStyle === 'linear' ? 'contained' : 'outlined'}
              >
                Linear
              </Button>
            </Tooltip>
          </ButtonGroup>

          <ButtonGroup variant="contained" size="small">
            <Tooltip title={language === 'te' ? 'జూమ్ ఇన్' : 'Zoom In'}>
              <Button onClick={() => handleZoom(1.3)}>
                <ZoomInIcon sx={{ fontSize: '18px' }} />
              </Button>
            </Tooltip>
            <Tooltip title={language === 'te' ? 'జూమ్ అవుట్' : 'Zoom Out'}>
              <Button onClick={() => handleZoom(0.7)}>
                <ZoomOutIcon sx={{ fontSize: '18px' }} />
              </Button>
            </Tooltip>
            <Tooltip title={language === 'te' ? 'రీసెట్' : 'Reset'}>
              <Button onClick={handleReset}>
                <RestartAltIcon sx={{ fontSize: '18px' }} />
              </Button>
            </Tooltip>
          </ButtonGroup>

          <Tooltip title={language === 'te' ? 'డౌన్‌లోడ్' : 'Download'}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleDownload}
              startIcon={<FileDownloadIcon />}
            >
              {isMobile ? '' : language === 'te' ? 'డౌన్‌లోడ్' : 'Download'}
            </Button>
          </Tooltip>
        </Box>
      </Paper>

      {/* Legend */}
      <Paper sx={{ p: 2, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              backgroundColor: '#F97316',
              border: '2px solid white',
              borderRadius: '2px',
            }}
          />
          <span style={{ fontWeight: 500, fontSize: '16px' }}>{language === 'te' ? 'పురుషుడు (అడవాయిన)' : 'Male'}</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: '2px solid white',
            }}
          />
          <span style={{ fontWeight: 500, fontSize: '16px' }}>{language === 'te' ? 'స్త్రీ (మహిళ)' : 'Female'}</span>
        </Box>
      </Paper>

      {/* SVG Container - Large and Scrollable */}
      <Paper sx={{ overflow: 'auto', height: isMobile ? '440px' : '640px', width: '100%', backgroundColor: '#fafafa' }}>
        <svg
          ref={svgRef}
          style={{
            display: 'block',
            backgroundColor: 'white',
            minWidth: '100%',
            minHeight: '100%',
          }}
        />
      </Paper>

      {/* Modal for person details */}
      <GenealogyModal
        open={showModal}
        onClose={() => setShowModal(false)}
        person={selectedNode}
      />
    </Box>
  )
}
